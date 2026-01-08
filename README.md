# MailTrim

MailTrim is a clean, read-only Gmail utility that helps you instantly understand and control the newsletters cluttering your inbox.

## Features

- 🔍 **Scan Your Inbox**: Automatically scans your Promotions and newsletter emails
- 📊 **Clear Insights**: See total emails received, unread counts, and the most active senders
- 🔗 **Unsubscribe Links**: Surfaces official unsubscribe links already present in emails
- 🛡️ **Read-Only Access**: Never deletes, modifies, or sends emails on your behalf
- 🔒 **Privacy First**: No private message content is stored - everything is processed transparently
- ⚡ **Safe Unsubscribing**: Opt out with a single click in a new tab

## How It Works

1. **Connect Securely**: Authenticate with Gmail using OAuth2 with read-only access
2. **Scan Emails**: MailTrim scans your Promotions and Updates categories for newsletters
3. **View Insights**: See all newsletter senders grouped with statistics
4. **Unsubscribe Safely**: Click to find and open official unsubscribe links in a new tab

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Project with Gmail API enabled

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/callback`
   - Save your Client ID and Client Secret

### 2. Install Dependencies

```bash
npm run install-all
```

### 3. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/callback
   PORT=5000
   CLIENT_URL=http://localhost:3000
   SESSION_SECRET=your-random-session-secret-here
   ```

### 4. Run the Application

Development mode (runs both server and client):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Production Deployment

1. Update `.env` with production URLs:
   - Set `CLIENT_URL` to your frontend domain
   - Set `GOOGLE_REDIRECT_URI` to your production callback URL
   - Set `NODE_ENV=production`
   - Use a secure `SESSION_SECRET`

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Serve the built files (you may want to configure your server to serve the `client/build` directory)

## Privacy & Security

- **Read-Only Access**: MailTrim only requests `gmail.readonly` scope
- **No Data Storage**: Email content is never stored - only metadata (sender, subject, dates)
- **No Modifications**: MailTrim never deletes, modifies, or sends emails
- **Transparent Processing**: All processing happens in real-time
- **Secure Authentication**: Uses OAuth2 with secure session management

## Technology Stack

- **Backend**: Node.js, Express, Google APIs
- **Frontend**: React, React Router
- **Authentication**: OAuth2 with Google
- **Email Processing**: Gmail API

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

