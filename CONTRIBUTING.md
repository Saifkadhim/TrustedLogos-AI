# Contributing to TrustedLogos

Thank you for your interest in contributing to TrustedLogos! We welcome contributions from the community and appreciate your help in making this project better.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Community Guidelines](#community-guidelines)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/trustedlogos-website.git
   cd trustedlogos-website
   ```
3. Install dependencies: `npm install`
4. Set up environment variables (see [README.md](README.md))
5. Start the development server: `npm run dev`

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git for version control
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

- Supabase account and project

### Environment Setup

1. Copy `.env.example` to `.env`
2. Update `.env` with your Supabase credentials
3. Run database migrations in your Supabase project
4. Test the application locally

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and configurations
├── pages/         # Page components and routes
└── ...
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Follow React hooks rules and best practices
- Use Tailwind CSS for styling

## Contributing Guidelines

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes: `git commit -m "Add your descriptive commit message"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request on GitHub

## Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Reference any related issues
- Keep PRs focused and atomic (one feature/fix per PR)

### PR Template

When creating a PR, please include:

- **Description**: What does this PR do?
- **Type**: Feature, Bug Fix, Documentation, etc.
- **Testing**: How was this tested?
- **Screenshots**: For UI changes
- **Breaking Changes**: Any breaking changes?

## Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🧪 **Tests and test improvements**
- 🔧 **Build and tooling improvements**
- 🌐 **Translations and accessibility**

## Community Guidelines

- Be respectful and professional in all interactions
- Follow the [GitHub Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines)
- Help others and be welcoming to newcomers
- Focus on constructive feedback and collaboration

## Questions?
