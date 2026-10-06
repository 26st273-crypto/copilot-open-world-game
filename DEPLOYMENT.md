# Deployment Guide

## Quick Deploy (Free Tier)

### Backend on Render

1. Go to https://render.com
2. Sign up / Log in
3. Click "Create" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: copilot-open-world
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=3000
     ```
6. Click "Create Web Service"

### Frontend on Vercel

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Environment variables:
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```
7. Click "Deploy"

## Connect Frontend to Backend

Update `client/src/game.js`:

```javascript
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = process.env.VITE_API_URL || window.location.host;
this.socket = io(`${protocol}//${host}`);
```

## Domain Setup (Optional)

### Custom Domain on Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records

### Custom Domain on Render
1. Go to Environment → Custom Domains
2. Add your custom domain
3. Update DNS records

## SSL/HTTPS

Both Render and Vercel provide free SSL certificates automatically.

## Database (Future)

To add PostgreSQL:

1. Create database on Render's PostgreSQL add-on
2. Get connection string
3. Add to environment variables:
   ```
   DATABASE_URL=postgresql://...
   ```

## Monitoring

- **Render**: View logs in Dashboard → Logs
- **Vercel**: View logs in Project → Functions Logs

## Troubleshooting

### Connection Issues
- Check CORS settings in `server/index.js`
- Verify socket.io connection URL
- Check browser console for errors

### Build Failures
- Check Node.js version (16+ required)
- Verify all dependencies in package.json
- Check build logs for specific errors

### Port Issues
- Render assigns dynamic ports, don't hardcode
- Use `process.env.PORT` in code
