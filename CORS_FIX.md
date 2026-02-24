# CORS Fix Summary

## Problem
Frontend deployed on Vercel (`https://interview-wednesday.vercel.app`) was blocked by CORS because backend only allowed `http://localhost:5173`.

## Solution
Updated backend CORS configuration to support multiple allowed origins.

### Files Changed

#### 1. `backend/src/config/env.js`
- Added `allowedOrigins` array that parses `ALLOWED_ORIGINS` env variable
- Falls back to `['http://localhost:5173', 'https://interview-wednesday.vercel.app']` if not set

#### 2. `backend/src/app.js`
- Changed CORS `origin` from single string to dynamic function
- Validates incoming origin against `allowedOrigins` array
- Allows requests without origin (like Postman, direct server requests)

#### 3. `backend/.env.example`
- Added `ALLOWED_ORIGINS` with example value

#### 4. `README.md`
- Documented new `ALLOWED_ORIGINS` environment variable

#### 5. `DEPLOYMENT.md` (new)
- Step-by-step guide to update Render environment variables
- Testing instructions

## Next Steps on Render

1. Go to Render dashboard → Your backend service → Environment
2. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://interview-wednesday.vercel.app,http://localhost:5173
   ```
3. Save changes (Render will auto-redeploy)
4. Test at https://interview-wednesday.vercel.app

## Local Testing

The code already works locally since `http://localhost:5173` is in the default `allowedOrigins`.

## Benefits

✅ Supports production deployment  
✅ Maintains local development workflow  
✅ Easy to add more allowed origins (comma-separated)  
✅ Secure: only explicitly allowed origins can access the API  
