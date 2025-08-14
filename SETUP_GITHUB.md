# 🚀 GitHub Repository Setup Guide

Follow these steps to upload your TrustedLogos project to GitHub:

## 📋 Prerequisites

1. **GitHub Account**: Make sure you have a GitHub account at [github.com](https://github.com)
2. **Git Installed**: Install Git on your computer from [git-scm.com](https://git-scm.com)

## 🔧 Step-by-Step Setup

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `trustedlogos-website`
   - **Description**: `A modern logo discovery and AI-powered logo generation platform`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### 2. Initialize Git in Your Project

Open your terminal/command prompt in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: TrustedLogos website with AI logo generator"

# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/trustedlogos-website.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

### 3. Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed:

```bash
# Create repository and push in one command
gh repo create trustedlogos-website --public --source=. --remote=origin --push
```

### 4. Set Up Environment Variables for Deployment

If you're deploying to Netlify or Vercel:

1. **Don't commit your `.env` file** (it's already in .gitignore)
2. **Add environment variables** in your deployment platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🔄 Future Updates

To update your repository after making changes:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 🌐 Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account
4. Select your `trustedlogos-website` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Netlify dashboard
7. Deploy!

## 📚 Repository Structure

Your repository will include:

```
trustedlogos-website/
├── src/                    # Source code
├── supabase/              # Database migrations
├── public/                # Static assets
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── CONTRIBUTING.md       # Contribution guidelines
├── package.json          # Dependencies and scripts
└── ...                   # Other config files
```

## 🆘 Troubleshooting

### Common Issues:

1. **"Repository already exists"**
   - Use a different repository name or delete the existing one

2. **Authentication failed**
   - Set up SSH keys or use personal access token
   - See [GitHub's authentication guide](https://docs.github.com/en/authentication)

3. **Large files rejected**
   - Check if any files exceed GitHub's 100MB limit
   - Use Git LFS for large files if needed

### Need Help?

- 📖 [GitHub Documentation](https://docs.github.com)
- 💬 [GitHub Community](https://github.community)
- 🎓 [Git Tutorial](https://git-scm.com/docs/gittutorial)

---

**🎉 Once uploaded, your repository will be available at:**
`https://github.com/YOUR_USERNAME/trustedlogos-website`