# Deployment Guide

## Backend (Render)

### Update Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com/
2. Navigate to your `interview-wednesday` backend service
3. Click on **Environment** in the left sidebar
4. Add or update these environment variables:

```
MONGODB_URI=<your-mongodb-atlas-connection-string>
OPENWEATHER_API_KEY=<your-openweather-api-key>
NODE_ENV=production
ALLOWED_ORIGINS=https://interview-wednesday.vercel.app,http://localhost:5173
```

5. Click **Save Changes**
6. Render will automatically redeploy your backend with the new CORS configuration

### Notes

- `ALLOWED_ORIGINS` accepts a comma-separated list of allowed origins
- Always include your production frontend URL(s) in `ALLOWED_ORIGINS`
- Keep `http://localhost:5173` for local development testing

## Frontend (Vercel)

### Environment Variables

Make sure your Vercel project has:

```
VITE_API_BASE_URL=https://interview-wednesday.onrender.com/api/v1
```

### Redeploy

If you need to redeploy:

```bash
git push origin main
```

Vercel will automatically redeploy from your GitHub repository.

## Testing the Fix

After updating `ALLOWED_ORIGINS` on Render and redeployment completes:

1. Visit https://interview-wednesday.vercel.app
2. Search for a city (e.g., "London")
3. The CORS error should be resolved
4. Check browser DevTools Console for any remaining errors

## Troubleshooting

### CORS Still Blocked

- Verify `ALLOWED_ORIGINS` includes your exact Vercel URL (check for `http` vs `https`)
- Wait 1-2 minutes for Render deployment to complete
- Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Check Render logs for any startup errors

### Backend Not Responding

- Check Render service logs
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` for cloud access
- Confirm `OPENWEATHER_API_KEY` is valid
