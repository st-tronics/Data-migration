# Netlify Deployment Guide - Data Migration Tool Demo

This guide explains how to deploy a demo version of the Data Migration Planning and Delivery Tool to Netlify.

## Overview

The Netlify deployment provides a **frontend-only demo** with mock data served through Netlify Functions (serverless). This allows you to showcase the tool's UI and functionality without deploying the full backend infrastructure.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com)
2. **Git Repository**: Push this project to GitHub, GitLab, or Bitbucket
3. **Node.js**: Version 18 or higher

## Deployment Options

### Option 1: Deploy via Netlify UI (Recommended for Demo)

1. **Login to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select this repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Functions directory**: `netlify/functions`

4. **Environment Variables** (Optional)
   ```
   REACT_APP_DEMO_MODE=true
   REACT_APP_API_URL=/.netlify/functions
   NODE_VERSION=18
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (3-5 minutes)
   - Your demo will be live at: `https://[random-name].netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (optional)

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: One-Click Deploy

Click the button below to deploy directly:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/data-migration-tool)

## Project Structure for Netlify

```
data-migration-tool/
├── netlify.toml                 # Netlify configuration
├── netlify/
│   └── functions/
│       └── api.ts              # Serverless API with mock data
├── frontend/
│   ├── package.json            # Frontend dependencies
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.tsx             # Main React app
│       ├── pages/
│       │   └── Dashboard.tsx   # Dashboard component
│       └── ...
└── docs/
    └── NETLIFY_DEPLOYMENT.md   # This file
```

## Configuration Files

### netlify.toml
The `netlify.toml` file at the project root configures:
- Build settings (base directory, build command, publish directory)
- Redirects for client-side routing
- Security headers
- Serverless functions directory
- Environment variables

### netlify/functions/api.ts
Serverless function that provides mock API endpoints:
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/projects` - List of projects
- `GET /api/projects/:id` - Project details
- `GET /api/sources` - Source systems
- `GET /api/mappings` - Migration mappings
- `GET /api/plans` - Migration plans
- `POST /api/*` - Create operations (mock responses)

## Frontend Setup

### Required Files

1. **frontend/package.json** - Already created with dependencies:
   - React 18
   - Material-UI
   - Redux Toolkit
   - React Router
   - Recharts (for visualizations)

2. **frontend/public/index.html** - Create this file:
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <meta name="theme-color" content="#000000" />
       <meta name="description" content="Enterprise Data Migration Planning Tool" />
       <title>Data Migration Tool - Demo</title>
     </head>
     <body>
       <noscript>You need to enable JavaScript to run this app.</noscript>
       <div id="root"></div>
     </body>
   </html>
   ```

3. **frontend/src/index.tsx** - Create this file:
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';

   const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
   );
   root.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

4. **frontend/src/theme.ts** - Create Material-UI theme:
   ```tsx
   import { createTheme } from '@mui/material/styles';

   export const theme = createTheme({
     palette: {
       primary: {
         main: '#1976d2',
       },
       secondary: {
         main: '#dc004e',
       },
     },
   });
   ```

5. **frontend/src/store.ts** - Create Redux store:
   ```tsx
   import { configureStore } from '@reduxjs/toolkit';

   export const store = configureStore({
     reducer: {},
   });

   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   ```

## Demo Features

The Netlify demo includes:

✅ **Dashboard** - Overview with statistics and charts
✅ **Project List** - View all migration projects
✅ **Source Discovery** - Mock source system data
✅ **Mapping Engine** - Compatibility analysis visualization
✅ **Migration Planning** - Timeline and phase views
✅ **Reports** - Sample report generation
✅ **Responsive Design** - Works on mobile and desktop

## Limitations of Demo

⚠️ **Demo Limitations**:
- Uses mock data (no real database)
- No authentication/authorization
- No data persistence (refreshing resets data)
- Limited API functionality
- No file uploads or downloads
- No real-time updates

For full functionality, deploy the complete backend infrastructure using Kubernetes (see `infrastructure/kubernetes/deployment.yaml`).

## Custom Domain

To use a custom domain:

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

## Environment Variables

Set these in Netlify UI (Site Settings → Environment Variables):

```bash
# Demo mode flag
REACT_APP_DEMO_MODE=true

# API endpoint (uses Netlify Functions)
REACT_APP_API_URL=/.netlify/functions

# Optional: Analytics
REACT_APP_ANALYTICS_ID=your-analytics-id
```

## Monitoring & Analytics

### Netlify Analytics
- Enable in Site Settings → Analytics
- View traffic, performance, and errors

### Custom Analytics
Add Google Analytics or similar:
```tsx
// In frontend/src/index.tsx
import ReactGA from 'react-ga4';

if (process.env.REACT_APP_ANALYTICS_ID) {
  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID);
}
```

## Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors
**Solution**: 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Functions Not Working

**Issue**: API calls return 404
**Solution**: 
- Check `netlify.toml` functions directory is correct
- Verify function files are in `netlify/functions/`
- Check Netlify Functions logs in dashboard

### Routing Issues

**Issue**: Page refresh returns 404
**Solution**: 
- Verify redirect rule in `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

### Slow Build Times

**Issue**: Build takes too long
**Solution**:
- Enable build cache in Netlify settings
- Optimize dependencies in package.json
- Use `npm ci` instead of `npm install`

## Performance Optimization

### 1. Enable Build Plugins
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[plugins]]
  package = "netlify-plugin-cache"
```

### 2. Asset Optimization
- Images: Use WebP format
- Code splitting: Enabled by default with React
- Lazy loading: Implement for routes

### 3. CDN Configuration
Netlify automatically serves from global CDN with:
- Automatic HTTPS
- HTTP/2
- Brotli compression
- Smart CDN routing

## Cost Estimation

### Netlify Free Tier Includes:
- 100GB bandwidth/month
- 300 build minutes/month
- 125k serverless function requests/month
- Unlimited sites
- HTTPS included

**Demo Usage**: Well within free tier limits

### Paid Plans (if needed):
- **Pro**: $19/month - 400GB bandwidth, 1000 build minutes
- **Business**: $99/month - 1TB bandwidth, 3000 build minutes

## Security Considerations

### Demo Security Features:
✅ HTTPS enabled by default
✅ Security headers configured
✅ CORS properly configured
✅ No sensitive data exposed
✅ Rate limiting on functions

### Additional Security (Production):
- Enable Netlify Identity for authentication
- Add API rate limiting
- Implement CAPTCHA for forms
- Use environment variables for secrets

## Updating the Demo

### Automatic Deploys
Netlify automatically deploys when you push to your Git repository:
- Push to `main` branch → Production deploy
- Push to other branches → Preview deploy

### Manual Deploy
```bash
netlify deploy --prod
```

### Rollback
In Netlify UI:
1. Go to Deploys
2. Find previous successful deploy
3. Click "Publish deploy"

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Community**: https://answers.netlify.com
- **Status Page**: https://www.netlifystatus.com

## Next Steps

After deploying the demo:

1. **Share the URL** with stakeholders
2. **Gather feedback** on UI/UX
3. **Plan full deployment** using Kubernetes for production
4. **Customize branding** (colors, logo, etc.)
5. **Add custom domain** for professional appearance

## Demo URL Example

Once deployed, your demo will be accessible at:
```
https://data-migration-tool-demo.netlify.app
```

You can customize the subdomain in Netlify settings.

---

## Quick Start Commands

```bash
# Clone repository
git clone <your-repo-url>
cd data-migration-tool

# Install frontend dependencies
cd frontend
npm install

# Test locally
npm start

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## Demo Credentials

Since this is a demo with mock data, no login is required. The demo runs in "demo mode" with pre-populated data.

For a production deployment with authentication, see the full deployment guide in `docs/architecture/SYSTEM_ARCHITECTURE.md`.