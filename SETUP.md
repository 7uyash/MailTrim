# MailTrim Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

This will install dependencies for both the backend and frontend.

### 2. Google Cloud Console Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Gmail API:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Gmail API"
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**
   - If prompted, configure OAuth consent screen first:
     - Choose **External** (unless you have Google Workspace)
     - Fill in required fields (App name, User support email, Developer contact)
     - Add scopes: `.../auth/gmail.readonly`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`
     - Add test users (your Gmail account) if in testing mode
   - Application type: **Web application**
   - Name: MailTrim (or any name)
   - Authorized redirect URIs: `http://localhost:5000/api/auth/callback`
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   GOOGLE_CLIENT_ID=paste_your_client_id_here
   GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/callback
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=generate-a-random-secret-here
   CLIENT_URL=http://localhost:3000
   ```

   **Note**: Generate a random `SESSION_SECRET` (you can use any random string).

### 4. Run the Application

**Option 1: Run both together (recommended for development)**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
cd client && npm start
```

### 5. Access the Application

- Open your browser to: http://localhost:3000
- Click "Connect Gmail Account"
- Sign in with your Google account
- Grant read-only access to Gmail
- You'll be redirected to the dashboard

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:5000/api/auth/callback`
- Check your `.env` file has the correct `GOOGLE_REDIRECT_URI`

### "Access blocked" error
- If your app is in testing mode, make sure your Gmail account is added as a test user
- Go to OAuth consent screen > Test users > Add users

### Port already in use
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Update `GOOGLE_REDIRECT_URI` accordingly

### CORS errors
- Make sure `CLIENT_URL` in `.env` matches your frontend URL
- Check that both server and client are running

## Production Deployment

For production:

1. Update `.env`:
   - Set `NODE_ENV=production`
   - Update `CLIENT_URL` to your production domain
   - Update `GOOGLE_REDIRECT_URI` to your production callback URL
   - Use a strong, random `SESSION_SECRET`
   - Enable HTTPS

2. Update Google Cloud Console:
   - Add production redirect URI to OAuth credentials
   - Publish your OAuth app (if ready for public use)

3. Build frontend:
   ```bash
   npm run build
   ```

4. Serve the application:
   - Configure your server to serve `client/build` for frontend
   - Run Node.js server for backend API

## Security Notes

- Never commit `.env` file to version control
- Use strong, random `SESSION_SECRET` in production
- Enable HTTPS in production
- Regularly rotate OAuth credentials if compromised

