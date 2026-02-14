# Anurag Tewari - Personal Website

A clean, modern personal website for showcasing AI transformation and investing insights.

## Tech Stack

- **React 19** - Frontend framework
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icons

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

The site will be available at `http://localhost:3000`

## Build for Production

```bash
yarn build
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Deploy (zero config - it just works!)

## Project Structure

```
├── src/
│   ├── components/        # UI components
│   │   ├── layout/        # Navbar, Footer
│   │   ├── sections/      # Page sections
│   │   └── ui/            # Shadcn components
│   ├── data/
│   │   └── insights.js    # Static blog content
│   ├── pages/             # Route pages
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md
```

## Customization

### Adding New Insights

Edit `src/data/insights.js`:

```javascript
export const aiInsights = [
  {
    id: "unique-slug",
    title: "Your Title",
    summary: "Brief description",
    content: `Your content here...`,
    category: "ai",
    tags: ["tag1", "tag2"],
    created_at: "2025-01-15"
  }
];
```

### Connecting Newsletter (ConvertKit, Mailchimp, etc.)

Edit `src/components/sections/NewsletterSection.jsx` - replace the TODO with your service's API call.

### Connecting Contact Form (Formspree, etc.)

Edit `src/components/sections/ContactSection.jsx` - replace the TODO with your form service endpoint.

### Updating Social Links

Edit `src/components/layout/Footer.jsx` to update YouTube, LinkedIn, Instagram URLs.

### Updating Profile Image

Edit `src/components/sections/HeroSection.jsx` to change the image URL.

## License

MIT
