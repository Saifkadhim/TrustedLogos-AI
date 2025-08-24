# TrustedLogos AI - Logo Collection & Management Platform

A React-based web application for managing and browsing logo collections with AI-powered description generation.

## 🚀 Features

- **Logo Collection Browser**: Browse and filter logos by industry, type, color, and shape
- **Admin Dashboard**: Complete admin panel for logo management
- **AI-Powered Descriptions**: Generate comprehensive company background and logo analysis using Google Gemini AI
- **Logo Management**: Add, edit, and delete logos with advanced filtering and pagination
- **Color Standardization**: Predefined color palette for consistent brand colors
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Saifkadhim/TrustedLogos-AI.git
cd TrustedLogos-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
VITE_OWNER_CODE=your_owner_code
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 Deployment

### Deploy to Vercel

1. **Fork/Clone this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Set Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_OWNER_CODE=your_owner_code
   VITE_ADMIN_USERNAME=your_admin_username
   VITE_ADMIN_PASSWORD=your_admin_password
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Deploy**: Click Deploy and your app will be live!

### Deploy to Netlify

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - New site from Git → Choose your repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**: Add the same variables as above in Site Settings → Environment Variables

4. **Deploy**: Your site will be live in minutes!

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains your static files
# Upload to any static hosting service
```

## 🎯 Key Features Implemented

### 🤖 **AI-Powered Logo Analysis**
- **Company Research**: Generates company background and history
- **Logo Description**: Detailed visual analysis of logo elements
- **Strength Analysis**: Identifies strategic advantages and design strengths
- **Enhancement**: Improves existing descriptions with AI insights

### 🎨 **Logo Management**
- **Add Logos**: Upload and categorize logos with detailed information
- **Manage Logos**: Edit, delete, and organize existing logos
- **Color Standardization**: 11 predefined colors for consistent branding
- **Shape Categories**: 8 logo shape classifications

### 🔍 **Advanced Filtering**
- **Industry Categories**: Filter by 20+ industry types
- **Logo Types**: Wordmarks, Pictorial, Abstract, Combination, etc.
- **Color Filtering**: Filter by primary/secondary colors
- **Shape Filtering**: Filter by geometric properties
- **Search**: Text-based logo name search

### 📱 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Pagination**: 50 logos per page for optimal performance
- **Export Functionality**: Download filtered results as JSON
- **View Modes**: Grid and list view options

## 🔒 Admin Features

- **Secure Authentication**: Owner code + admin credentials
- **Logo CRUD Operations**: Full create, read, update, delete functionality
- **Bulk Operations**: Export and manage multiple logos
- **Analytics Dashboard**: Overview of logo collection stats

## 🌟 Recent Updates

- ✅ **Gemini AI Integration**: Real AI-powered content generation
- ✅ **Color Standardization**: Unified color palette across the platform
- ✅ **Enhanced Logo Management**: Separate page with full editing capabilities
- ✅ **Pagination System**: Improved performance for large datasets
- ✅ **Shape Standardization**: Consistent shape categories
- ✅ **Advanced Error Handling**: Better user experience with detailed error messages

## 📝 Usage

### For Visitors
1. Browse logos at `/brands-logos`
2. Use filters to find specific types of logos
3. View detailed logo information

### For Administrators
1. Access admin dashboard at `/admin`
2. Add new logos with AI-generated descriptions
3. Manage existing logos with the management interface
4. Use AI tools to enhance logo descriptions

## 🔗 Live Demo

Visit the deployed application: [Your Deployed URL Here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🚀 Quick Start

```bash
git clone https://github.com/Saifkadhim/TrustedLogos-AI.git
cd TrustedLogos-AI
npm install
npm run dev
```

The application will be available at `http://localhost:5173`
