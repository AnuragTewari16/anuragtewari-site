# AnuragTewari.com - Personal Website PRD

## Original Problem Statement
Build a personal website for Anurag Tewari presenting him as an AI transformation and investing creator. Clean, modern, text-first design inspired by nateherk.com. Not a consulting firm website - a personal experimental project.

## User Personas
1. **Working Professionals** - Looking to improve productivity with AI and learn about investing
2. **Hiring Managers/Founders** - Evaluating Anurag's expertise and approach
3. **Individual Learners** - Seeking practical AI and investing education

## Core Requirements (Static)
- Home page with hero, about, AI preview, investing preview, newsletter, contact sections
- AI Insights page - hub for AI transformation content
- Investing Insights page - hub for investing/passive income content with disclaimers
- Newsletter signup (MongoDB storage)
- Contact form (MongoDB storage)
- Responsive mobile design
- Structure for future Impressum/Privacy Policy pages

## What's Been Implemented (June 2025)
- ✅ Full Home page with all sections
- ✅ AI Insights page with article cards
- ✅ Investing Insights page with disclaimer and article cards
- ✅ Individual insight detail pages with markdown-like content rendering
- ✅ Newsletter form with MongoDB integration
- ✅ Contact form with MongoDB integration
- ✅ 6 sample insights seeded (3 AI, 3 Investing)
- ✅ Responsive navigation with mobile menu
- ✅ Footer with social link placeholders
- ✅ Light modern color palette (#F5F5F7 bg, #1D4ED8 primary, #0D9488 secondary)
- ✅ Manrope + Inter typography

## Prioritized Backlog

### P0 (Critical)
- None - MVP complete

### P1 (High Priority)
- Add real YouTube channel URLs (Anurag Automates, Anurag Invests)
- Add real LinkedIn and Instagram URLs
- Replace profile photo placeholder with actual photo
- Add Impressum page (German legal requirement)
- Add Privacy Policy / Datenschutzerklärung page

### P2 (Medium Priority)
- Admin dashboard to manage insights (CRUD)
- Email notifications for new contact submissions
- Newsletter export functionality
- YouTube video embedding for insights

### P3 (Nice to Have)
- Blog/RSS feed
- Dark mode toggle
- Search functionality for insights
- Tags filtering on insights pages
- Analytics integration

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, React Router, Shadcn/UI
- **Backend**: FastAPI, Motor (MongoDB async driver)
- **Database**: MongoDB
- **Fonts**: Manrope (headings), Inter (body)

## Next Action Items
1. Replace placeholder social URLs and profile photo
2. Create Impressum and Privacy Policy pages for German compliance
3. Consider newsletter integration (Mailchimp/ConvertKit) for email campaigns
