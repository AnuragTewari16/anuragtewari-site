# Anurag Tewari - Personal Website

A clean, modern personal website for showcasing AI transformation and investing insights.

## Tech Stack

- **React 19** - Frontend framework
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icons

## Features

- 📱 Fully responsive design
- 🎨 Modern, minimal aesthetic
- 📝 Static insights/blog pages
- 📧 Newsletter signup form (ready for integration)
- 📬 Contact form (ready for integration)
- ⚖️ Legal pages (Impressum, Privacy Policy)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd frontend

# Install dependencies
yarn install

# Start development server
yarn start
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
yarn build
```

This creates an optimized production build in the `build` folder.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `frontend` (if in monorepo)
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect repository in Netlify
3. Set build command: `yarn build`
4. Set publish directory: `build`
5. Deploy!

### GitHub Pages

1. Install gh-pages: `yarn add -D gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/repo-name",
   "scripts": {
     "predeploy": "yarn build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Run: `yarn deploy`

## Customization

### Adding New Insights

Edit `/src/data/insights.js` to add, modify, or remove insights:

```javascript
export const aiInsights = [
  {
    id: "unique-slug",
    title: "Your Title",
    summary: "Brief description",
    content: `Your markdown-like content here...`,
    category: "ai", // or "investing"
    tags: ["tag1", "tag2"],
    youtube_url: null, // or YouTube URL
    created_at: "2025-01-15"
  },
  // ... more insights
];
```

### Connecting Newsletter Service

Edit `/src/components/sections/NewsletterSection.jsx`:

```javascript
// Replace the TODO section with your service
const response = await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: 'YOUR_API_KEY', email, first_name: name })
});
```

### Connecting Contact Form

Edit `/src/components/sections/ContactSection.jsx`:

```javascript
// Replace the TODO section with your service (e.g., Formspree)
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Updating Social Links

Edit `/src/components/layout/Footer.jsx` to update YouTube, LinkedIn, and Instagram URLs.

### Updating Profile Image

Replace the image URL in `/src/components/sections/HeroSection.jsx`.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── AIPreviewSection.jsx
│   │   │   ├── InvestingPreviewSection.jsx
│   │   │   ├── NewsletterSection.jsx
│   │   │   └── ContactSection.jsx
│   │   ├── ui/              # Shadcn components
│   │   └── InsightCard.jsx
│   ├── data/
│   │   └── insights.js      # Static content
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AIInsightsPage.jsx
│   │   ├── InvestingInsightsPage.jsx
│   │   ├── InsightDetailPage.jsx
│   │   ├── ImpressumPage.jsx
│   │   └── PrivacyPolicyPage.jsx
│   ├── App.js
│   ├── App.css
│   └── index.css
└── package.json
```

## License

MIT License - Feel free to use this as a template for your own site.
