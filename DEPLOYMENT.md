# Deployment Guide: University Course Management System

This guide will walk you through deploying the University Course Management System to Netlify (frontend) and Railway (backend and database).

## Prerequisites

- GitHub account
- Netlify account (free tier) - [Sign up here](https://app.netlify.com/signup)
- Railway account (free tier) - [Sign up here](https://railway.app/login)

## Step 1: Prepare the Repository

Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment to Netlify and Railway"
git push
```

## Step 2: Deploy Backend to Railway

1. **Create a Railway account** if you don't have one
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create a new project in Railway**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your "University_Course_Management_System" repository
   - Click "Deploy Now"

3. **Add a MySQL database to your project**
   - In your project dashboard, click "New"
   - Select "Database" and then "MySQL"
   - Wait for the database to be provisioned

4. **Configure environment variables for your backend**
   - Go to your backend service
   - Click on the "Variables" tab
   - Add the following variables:
     ```
     SPRING_PROFILES_ACTIVE=prod
     SPRING_DATASOURCE_URL=${{DATABASE_URL}}
     SPRING_DATASOURCE_USERNAME=${{DATABASE_USERNAME}}
     SPRING_DATASOURCE_PASSWORD=${{DATABASE_PASSWORD}}
     JWT_SECRET=your_secure_jwt_secret_key_here
     ```

5. **Verify Backend Deployment**
   - Click on the "Deployments" tab to see the deployment status
   - Once deployed, click on "Settings" and find your service URL
   - Visit `your-service-url/actuator/health` to verify the backend is running

## Step 3: Deploy Frontend to Netlify

1. **Create a Netlify account** if you don't have one
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account

2. **Import your project**
   - Click "Add new site" > "Import an existing project"
   - Select GitHub and authorize Netlify
   - Select your "University_Course_Management_System" repository

3. **Configure build settings**
   - The netlify.toml file should handle this automatically
   - You should see:
     - Base directory: `frontend/course-management-ui`
     - Build command: `npm ci --legacy-peer-deps && npm run build`
     - Publish directory: `build`

4. **Update environment variables**
   - After your backend is deployed on Railway, get its URL
   - In Netlify, go to Site settings > Environment variables
   - Add `REACT_APP_API_BASE` with your Railway backend URL

5. **Deploy the site**
   - Click "Deploy site"
   - Wait for the build to complete
   - Netlify will provide you with a URL for your frontend

## Step 4: Configure CORS on the Backend

If you encounter CORS issues:

1. Add your Netlify frontend URL to the allowed origins in your backend code
2. Redeploy the backend to Railway

## Step 5: Custom Domain (Optional)

1. **For Netlify:**
   - Go to Site settings > Domain management > Add custom domain

2. **For Railway:**
   - Go to your backend service > Settings > Custom Domain

## Maintenance and Updates

To update your deployed application:

1. **Make changes to your code locally**
2. **Commit and push to GitHub**
3. **Both Netlify and Railway will automatically rebuild and redeploy**

## Troubleshooting

- **Frontend can't connect to backend:** Check CORS settings and ensure API_BASE is correct
- **Database connection issues:** Verify the database connection variables in Railway
- **Build failures:** Check the build logs on Netlify or Railway for specific error messages

## Cost Considerations

- Both Netlify and Railway offer free tiers with limitations
- Monitor your usage to avoid unexpected charges
- Railway free tier times out after inactivity, you'll need to reactivate it occasionally
