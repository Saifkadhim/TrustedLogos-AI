# TrustedLogos.com

A modern logo discovery and AI-powered logo generation platform built with React, TypeScript, and Supabase.

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
git clone https://github.com/YOUR_USERNAME/trustedlogos-website.git
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

The application is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@trustedlogos.com or join our community discussions.

---

Made with ❤️ for designers worldwide