# Gemini API Setup Guide

## 🚨 Current Issue
Your production environment is missing the `VITE_GEMINI_API_KEY` environment variable, causing AI features to fail with the error:
```
Error generating custom description: Error: Gemini API key is not configured
```

## 🔧 Quick Fix

### For Vercel Users:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production (and Preview if desired)
5. **Redeploy** your application

### For Netlify Users:
1. Go to [netlify.com/app](https://netlify.com/app)
2. Select your site
3. Go to **Site Settings** → **Environment Variables**
4. Add new variable:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
5. **Trigger a new deploy**

## 🔑 Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated key
5. **Keep it secure** - don't commit it to your repository

## 📁 Environment File Structure

### Local Development (.env file - NOT committed to git)
```bash
# .env (create this file locally)
VITE_GEMINI_API_KEY=your_actual_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_OWNER_CODE=your_owner_code
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password
```

### Production (Set in hosting platform)
- **Vercel**: Environment Variables in project settings
- **Netlify**: Environment Variables in site settings
- **Other platforms**: Check their documentation for environment variable configuration

## 🧪 Testing the Fix

After setting the environment variable:

1. **Redeploy** your application
2. **Check the admin dashboard** - you should see a green "Configured" status
3. **Test AI features** - try generating a logo description
4. **Check browser console** - no more "API key not configured" errors

## 🔍 Diagnostic Tools

Your admin dashboard now includes:
- **DiagnosticInfo component** - Shows configuration status
- **Better error handling** - Graceful fallbacks when API is unavailable
- **Configuration status** - Real-time environment variable status

## 🚫 Common Mistakes

1. **Wrong variable name**: Must be exactly `VITE_GEMINI_API_KEY`
2. **Missing redeploy**: Environment variables require a new deployment
3. **Wrong environment**: Make sure it's set for Production, not just Preview
4. **API key format**: Should be a long string, not wrapped in quotes

## 🔒 Security Notes

- **Never commit API keys** to your repository
- **Use environment variables** for all sensitive configuration
- **Rotate keys regularly** for production applications
- **Monitor usage** in Google AI Studio dashboard

## 📞 Need Help?

If you're still having issues:

1. Check the **DiagnosticInfo** component in your admin dashboard
2. Verify the environment variable is set correctly in your hosting platform
3. Ensure you've redeployed after adding the variable
4. Check that the API key is valid and has sufficient quota

## 🎯 Next Steps

1. ✅ Set the environment variable in your hosting platform
2. ✅ Redeploy your application
3. ✅ Test AI features in production
4. ✅ Monitor for any remaining errors
5. ✅ Consider setting up monitoring for API quota usage 