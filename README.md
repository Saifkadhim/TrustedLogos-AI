# TrustedLogos.com

A modern logo discovery and AI-powered logo generation platform built with React, TypeScript, and Supabase.

🌐 **Live Demo**: [Visit TrustedLogos.com](https://trustedlogos.netlify.app)
📂 **GitHub Repository**: [https://github.com/trustedlogos/trustedlogos-website](https://github.com/trustedlogos/trustedlogos-website)

## Features

- 🎨 **AI Logo Generator** - Create professional logos instantly with artificial intelligence
- 🔍 **Logo Discovery** - Browse thousands of professional logos across all industries
- 🎯 **AI Name Generator** - Generate unique business names powered by AI
- 🎨 **Color Palettes** - Explore curated color schemes for design inspiration
- 📝 **Font Library** - Discover and download beautiful fonts for your projects
- 👤 **User Authentication** - Secure sign-up and sign-in with Supabase Auth
- 🔐 **Admin Panel** - Content management system for administrators

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Database, Auth, Storage)
- **Routing**: React Router DOM
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trustedlogos/trustedlogos-website.git
cd trustedlogos-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
- Go to your Supabase dashboard
- Run the SQL migration from `supabase/migrations/create_profiles_table.sql`

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
├── AllImagesPage.tsx   # Logo discovery page
├── App.tsx             # Main application component
└── main.tsx           # Application entry point

supabase/
└── migrations/         # Database migration files
```

## Features Overview

### AI Logo Generator
- Industry-specific design intelligence
- Multiple logo types (Wordmarks, Lettermarks, Pictorial, etc.)
- Color scheme selection
- Style customization
- Instant generation and download

### Logo Discovery
- Browse by industry categories
- Filter by logo types, colors, and shapes
- Search functionality
- Favorites system
- High-resolution previews

### Authentication System
- Email/password authentication
- User profiles with company information
- Admin role management
- Row Level Security (RLS) policies

### Admin Features
- Logo management system
- Color palette administration
- User management
- Content moderation tools

## Deployment

### Netlify Deployment

This application is deployed on Netlify and configured for automatic deployments:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Manual Deployment

To deploy manually:

```bash
# Build the project
npm run build

# Deploy to Netlify (requires Netlify CLI)
npx netlify deploy --prod --dir=dist
```

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Database Setup

Before deploying, make sure to:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file in `supabase/migrations/` in your Supabase SQL editor
3. Configure Row Level Security policies
4. Add your Supabase credentials to environment variables

## Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/trustedlogos-website.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and commit: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features when applicable
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support:
- 📧 Email: support@trustedlogos.com
- 💬 GitHub Discussions: [Community Forum](https://github.com/trustedlogos/trustedlogos-website/discussions)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/trustedlogos/trustedlogos-website/issues)
- 💡 Feature Requests: [GitHub Issues](https://github.com/trustedlogos/trustedlogos-website/issues)

---
