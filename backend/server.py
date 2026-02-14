from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Newsletter Models
class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscribeRequest(BaseModel):
    name: str
    email: str

class NewsletterResponse(BaseModel):
    success: bool
    message: str

# Contact Models
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str

# Insight Models
class Insight(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    summary: str
    content: str
    category: str  # "ai" or "investing"
    tags: List[str] = []
    youtube_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InsightCreate(BaseModel):
    title: str
    summary: str
    content: str
    category: str
    tags: List[str] = []
    youtube_url: Optional[str] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Anurag Tewari API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Newsletter Endpoints
@api_router.post("/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(request: NewsletterSubscribeRequest):
    # Check if email already exists
    existing = await db.newsletter_subscribers.find_one({"email": request.email}, {"_id": 0})
    if existing:
        return NewsletterResponse(success=True, message="You're already subscribed!")
    
    subscriber = NewsletterSubscriber(name=request.name, email=request.email)
    doc = subscriber.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    await db.newsletter_subscribers.insert_one(doc)
    return NewsletterResponse(success=True, message="Successfully subscribed to the newsletter!")

@api_router.get("/newsletter/subscribers", response_model=List[NewsletterSubscriber])
async def get_newsletter_subscribers():
    subscribers = await db.newsletter_subscribers.find({}, {"_id": 0}).to_list(1000)
    for sub in subscribers:
        if isinstance(sub['subscribed_at'], str):
            sub['subscribed_at'] = datetime.fromisoformat(sub['subscribed_at'])
    return subscribers

# Contact Endpoints
@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(request: ContactRequest):
    contact = ContactMessage(name=request.name, email=request.email, message=request.message)
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return ContactResponse(success=True, message="Message sent successfully! I'll get back to you soon.")

@api_router.get("/contact/messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    for msg in messages:
        if isinstance(msg['created_at'], str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

# Insights Endpoints
@api_router.post("/insights", response_model=Insight)
async def create_insight(request: InsightCreate):
    insight = Insight(**request.model_dump())
    doc = insight.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.insights.insert_one(doc)
    return insight

@api_router.get("/insights", response_model=List[Insight])
async def get_insights(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    insights = await db.insights.find(query, {"_id": 0}).to_list(100)
    for insight in insights:
        if isinstance(insight['created_at'], str):
            insight['created_at'] = datetime.fromisoformat(insight['created_at'])
        if isinstance(insight['updated_at'], str):
            insight['updated_at'] = datetime.fromisoformat(insight['updated_at'])
    return insights

@api_router.get("/insights/{insight_id}", response_model=Insight)
async def get_insight(insight_id: str):
    insight = await db.insights.find_one({"id": insight_id}, {"_id": 0})
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    if isinstance(insight['created_at'], str):
        insight['created_at'] = datetime.fromisoformat(insight['created_at'])
    if isinstance(insight['updated_at'], str):
        insight['updated_at'] = datetime.fromisoformat(insight['updated_at'])
    return insight

# Seed initial insights
@api_router.post("/seed-insights")
async def seed_insights():
    # Check if already seeded
    existing = await db.insights.count_documents({})
    if existing > 0:
        return {"message": "Insights already seeded", "count": existing}
    
    sample_insights = [
        {
            "id": str(uuid.uuid4()),
            "title": "How I Use AI to Structure My Weekly Reviews",
            "summary": "A practical framework for using AI assistants to run effective personal and professional weekly reviews that actually drive improvement.",
            "content": """Weekly reviews are powerful, but most people either skip them or make them too complicated. Here's how I use AI to make mine both effective and sustainable.

## The Problem with Traditional Weekly Reviews

Most weekly reviews fail because they're either too vague ("How was my week?") or too detailed (50-item checklists). AI helps us find the middle ground.

## My AI-Assisted Framework

### Step 1: Brain Dump
I start by telling my AI assistant everything that happened this week. No structure, just talking. The AI helps organize this chaos into categories.

### Step 2: Pattern Recognition
I ask the AI to identify patterns. What kept coming up? Where did I spend most of my energy? What got consistently pushed off?

### Step 3: Decision Quality Check
For major decisions I made, I ask the AI to help me evaluate my reasoning. Was I reactive or strategic? Did I consider alternatives?

### Step 4: Next Week Setup
Based on the review, the AI helps me identify 3 priorities for next week. Not a to-do list - just three things that matter.

## Results

Since implementing this system, I've noticed:
- Better pattern recognition in my work habits
- Faster identification of time sinks
- More intentional decision-making
- Less anxiety about "missing something"

The key is consistency. AI makes it easier to show up every week because the cognitive load is shared.""",
            "category": "ai",
            "tags": ["productivity", "workflows", "decision-making"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Building a Personal Research Assistant with AI",
            "summary": "How to set up AI tools to help you research topics deeply without getting lost in information overload.",
            "content": """Information overload is real. Every time I start researching a topic, I end up with 47 browser tabs and no clear conclusions. Here's how I use AI to fix that.

## The Research Problem

Traditional research is exhausting because:
- There's always "one more source" to check
- It's hard to know when you have "enough" information
- Synthesizing information across sources takes forever
- You forget what you learned two days ago

## My AI Research System

### Setting Up the Assistant

I treat my AI assistant as a research partner, not a search engine. The key difference: I give it context about what I already know and what I'm trying to decide.

### The Research Loop

1. **Define the Question**: Not "tell me about X" but "I'm trying to decide Y, and I need to understand X to do that"
2. **Initial Synthesis**: Ask AI to give me the key frameworks and major perspectives
3. **Gap Identification**: Ask what I should know but probably don't
4. **Deep Dives**: Focused research on specific gaps
5. **Decision Mapping**: How does this new information change my options?

### Managing Notes

I keep my research notes in a simple system and periodically ask AI to summarize what I've learned and what questions remain.

## Why This Works

The AI doesn't replace research - it makes research sustainable. Instead of drowning in information, I have a structured conversation that builds understanding over time.""",
            "category": "ai",
            "tags": ["research", "productivity", "decision-making"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Workflows for Small Business Owners",
            "summary": "Practical, low-complexity AI workflows that small business owners can implement this week to save time on recurring tasks.",
            "content": """Small business owners are busy. You don't have time for complicated AI setups. Here are five workflows you can implement this week.

## Workflow 1: Customer Email Templates

**Time saved**: 30+ minutes daily

Instead of writing every customer email from scratch, create a "template brain" in your AI tool. Feed it examples of your best emails, your tone guidelines, and common scenarios.

When you need to reply, give the AI the context and let it draft. Your job is just to review and personalize.

## Workflow 2: Meeting Prep Summaries

**Time saved**: 15-20 minutes per meeting

Before any important meeting, ask AI to help you prepare:
- Review previous notes/emails with this person
- List key topics you should cover
- Identify potential questions they might ask
- Summarize any recent changes in their industry/situation

## Workflow 3: Content Repurposing

**Time saved**: 2-3 hours weekly

Wrote a detailed email to a client? That's content. Have AI help you turn it into:
- A LinkedIn post
- A section of your FAQ
- An internal process document
- A template for similar situations

## Workflow 4: Decision Documentation

**Time saved**: Prevents future mistakes

When you make important decisions, have AI help you document:
- What you decided
- Why you decided it
- What alternatives you considered
- What would make you revisit this decision

## Workflow 5: Weekly Business Review

**Time saved**: Makes existing review time more valuable

Use AI to help you analyze your week's metrics, customer feedback, and operational notes. Pattern recognition at scale.

## Start Simple

Pick one workflow. Use it for a week. Then add another. The goal isn't to AI-ify everything - it's to reclaim time for work that actually needs your human judgment.""",
            "category": "ai",
            "tags": ["small business", "workflows", "productivity"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Position Sizing: The Risk Management Fundamental Most Ignore",
            "summary": "Why position sizing matters more than entry points, and a practical framework for determining how much to allocate to any trade.",
            "content": """Most retail investors obsess over when to buy. The more important question: how much to buy. This is position sizing, and getting it wrong can destroy your portfolio even when your analysis is right.

## Disclaimer

I'm not a financial advisor. This is educational content about how I think about position sizing. Always do your own research.

## Why Position Sizing Matters

Imagine you find what looks like a great opportunity. You go all-in. It drops 40%. Even if you were right about the eventual direction, can you hold through that drawdown? Most can't.

Now imagine you sized it at 5% of your portfolio. A 40% drop means a 2% portfolio impact. Much easier to stay rational.

## My Position Sizing Framework

### Step 1: Define Your Risk Per Trade

I never risk more than 1-2% of my total portfolio on any single trade. This means if I'm completely wrong and hit my stop loss, I lose 1-2%.

### Step 2: Determine Your Stop Loss

Before entering any position, I know where I'm wrong. What price level would invalidate my thesis? That's my stop loss.

### Step 3: Calculate Position Size

Position Size = (Portfolio Risk Amount) / (Entry Price - Stop Loss Price)

Example:
- Portfolio: $10,000
- Max risk: 1% = $100
- Stock price: $50
- Stop loss: $45 (10% below entry)
- Position size: $100 / $5 = 20 shares = $1,000 (10% of portfolio)

### Step 4: Adjust for Conviction

Higher conviction doesn't mean bigger bets. It means tighter stops or more favorable entry points. The math stays the same.

## Common Mistakes

1. **Averaging down without a plan**: This is just increasing position size without new information
2. **Ignoring correlation**: Five "small" positions in correlated assets = one big position
3. **Revenge sizing**: Losing makes you want to bet bigger to "make it back"

## The Bottom Line

Position sizing is boring. It doesn't make for exciting trading stories. But it's the difference between staying in the game and blowing up.""",
            "category": "investing",
            "tags": ["risk management", "technical analysis", "fundamentals"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Technical Analysis Basics: Support, Resistance, and Why They Work",
            "summary": "A practical introduction to support and resistance levels - what they are, why they form, and how I use them in my analysis.",
            "content": """Technical analysis gets a bad reputation. Some of it is deserved - a lot of TA content is overcomplicated nonsense. But the fundamentals, like support and resistance, are actually just applied psychology.

## Disclaimer

This is educational content, not financial advice. I'm a retail investor sharing my learning, not a licensed professional.

## What Are Support and Resistance?

**Support**: A price level where buying pressure tends to overcome selling pressure. The price has trouble falling below this level.

**Resistance**: A price level where selling pressure tends to overcome buying pressure. The price has trouble rising above this level.

## Why Do They Form?

These levels work because of human psychology:

1. **Memory**: People remember what they paid. If you bought at $50 and it dropped to $40, you might sell when it gets back to $50 to "break even."

2. **Round Numbers**: $100, $50, $10 - these attract attention and orders cluster around them.

3. **Previous Pivots**: If a price bounced at $45 before, traders remember and place orders there again.

4. **Moving Averages**: Many traders watch the 50-day, 200-day moving averages. When price approaches these, orders cluster.

## How I Use Support and Resistance

### For Entry Points

I prefer entering near support levels. Why? Better risk/reward. My stop can be just below support, meaning I know quickly if I'm wrong.

### For Exit Points

Resistance levels are where I consider taking profits. Not necessarily selling everything, but reducing size.

### For Stop Losses

If a support level breaks decisively, it often becomes resistance. This is where I know my thesis was wrong.

## Common Mistakes

1. **Treating levels as exact prices**: These are zones, not precise numbers
2. **Ignoring context**: A support level on a daily chart matters more than one on a 5-minute chart
3. **Fighting the trend**: Support in a downtrend is weaker than support in an uptrend

## Practice

The best way to learn is to draw levels on charts and track what happens. No money needed - just observation.""",
            "category": "investing",
            "tags": ["technical analysis", "fundamentals", "education"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Passive Income Ideas for Working Professionals",
            "summary": "Realistic passive income strategies that complement a full-time job - what works, what doesn't, and how to get started.",
            "content": """The internet is full of passive income advice written by people who seem to have infinite time and capital. Here's a more realistic take for people with full-time jobs.

## Disclaimer

Not financial advice. Just my perspective on what I've learned exploring passive income while working full-time.

## The Passive Income Spectrum

Nothing is truly passive. Everything requires either:
- Upfront time investment
- Ongoing maintenance
- Capital

The question is: what's the ratio of input to output, and does it fit your life?

## What I've Explored

### Dividend Investing

**Reality**: Requires significant capital to generate meaningful income. $100,000 at 4% yield = $4,000/year = $333/month.

**Pros**: Truly passive once set up, compounds over time
**Cons**: Slow, requires capital, dividend stocks can underperform growth

**Verdict**: Good as part of a long-term strategy, not a quick win

### Content Creation (YouTube, Blog)

**Reality**: 6-18 months before meaningful revenue. Requires consistent time investment.

**Pros**: Low startup cost, unlimited upside, builds skills
**Cons**: Extremely competitive, requires unique angle, not passive initially

**Verdict**: Good if you enjoy creating, have expertise to share, and can commit long-term

### Digital Products

**Reality**: Courses, templates, ebooks - one-time creation, ongoing sales.

**Pros**: High margins, scalable
**Cons**: Marketing is ongoing work, requires audience or SEO skills

**Verdict**: Good if you have existing expertise and audience

## What I'm Focused On

1. **Dividend growth investing**: Slow but reliable. I'm not counting on this for income now, but it's a long-term play.

2. **Content creation**: Building audience through these insights and YouTube. No shortcuts here.

3. **Skill development**: The best "passive income" for a working professional is increasing your active income through valuable skills. Higher salary = more capital to deploy.

## The Unsexy Truth

Real passive income for most people:
1. Max out retirement accounts
2. Invest in index funds
3. Increase earning potential through skills
4. Be patient

Everything else is either:
- A lot more work than advertised
- Requires more capital than most people have
- Higher risk than presented

That doesn't mean don't try other approaches. Just go in with realistic expectations.""",
            "category": "investing",
            "tags": ["passive income", "long-term", "fundamentals"],
            "youtube_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    for insight in sample_insights:
        await db.insights.insert_one(insight)
    
    return {"message": "Seeded sample insights", "count": len(sample_insights)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
