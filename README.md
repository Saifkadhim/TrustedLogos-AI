# TrustedLogos - Dynamic Logo Showcase Platform

A modern, responsive logo showcase platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Dynamic Logo Management** - Add, edit, and organize logos through admin panel
- **Bulk Upload** - Upload multiple logos at once with drag-and-drop
- **Smart Categorization** - Auto-organize by logo type and industry
- **Search & Filter** - Find logos by name, type, industry, color, and shape
- **Responsive Design** - Works perfectly on desktop and mobile
- **Admin Dashboard** - Complete logo management system
- **Image Storage** - Secure cloud storage with Supabase

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Custom admin authentication
- **Icons**: Lucide React

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Environment Variables
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OWNER_CODE=your_owner_verification_code
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

### Vercel (Recommended)
1. **Fork/Clone** this repository to your GitHub
2. **Connect** to [Vercel](https://vercel.com)
3. **Import** your GitHub repository
4. **Set Environment Variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` 
   - `VITE_OWNER_CODE`
   - `VITE_ADMIN_USERNAME`
   - `VITE_ADMIN_PASSWORD`
5. **Deploy** - Vercel will auto-build and deploy

### Netlify
1. **Build** the project: `npm run build`
2. **Upload** the `dist` folder to Netlify
3. **Set Environment Variables** in Netlify dashboard

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the dist folder to any static hosting service
```

## 📊 Database Setup

### Supabase Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Create logos table
CREATE TABLE logos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  industry text NOT NULL,
  primary_color text NOT NULL DEFAULT '#000000',
  secondary_color text DEFAULT '#ffffff',
  shape text NOT NULL,
  information text,
  designer_url text,
  image_path text,
  image_name text,
  file_size integer,
  file_type text,
  is_public boolean DEFAULT true,
  downloads integer DEFAULT 0,
  likes integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (optional)
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON logos
FOR SELECT USING (is_public = true);

-- Create policy for authenticated write access  
CREATE POLICY "Authenticated write access" ON logos
FOR ALL USING (auth.role() = 'authenticated');
```

## 🔧 Admin Access

1. **Navigate** to `/console-setup`
2. **Sign in** with your admin credentials
3. **Access admin features**:
   - Add single logos
   - Bulk upload multiple logos
   - Manage logo database
   - View statistics

## 📱 Key Pages

- **Homepage** (`/`) - Logo showcase with categories
- **All Logos** (`/brands-logos`) - Searchable logo gallery  
- **Admin Login** (`/console-setup`) - Admin authentication
- **Admin Dashboard** (`/admin`) - Logo management
- **Bulk Upload** (`/admin/bulk-upload`) - Multiple logo upload

## 🎨 Logo Categories

### Logo Types
- Wordmarks, Lettermarks, Pictorial Marks
- Abstract Marks, Combination Marks
- Emblem Logos, Mascot Logos

### Industries  
- Technology, Fashion, Food & Drinks
- Restaurant, Automotive, E-commerce
- Electronics, Industrial, Internet
- Media/TV, Sport, Other

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the [Issues](../../issues) page
- Review the [Documentation](../../wiki)
- Contact the development team

---

Built with ❤️ for logo enthusiasts worldwide
