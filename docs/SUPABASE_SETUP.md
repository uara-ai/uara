# Supabase Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication with Supabase in your Next.js application.

## Prerequisites

- A Supabase account
- A Google Cloud Console account
- Node.js and npm/bun installed

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Set Up Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/auth/callback`
     - For production: `https://yourdomain.com/auth/callback`
5. Copy the **Client ID** and **Client Secret**

### 3.2 Configure Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Set the **Redirect URL** to: `https://your-project-id.supabase.co/auth/v1/callback`
5. Click **Save**

## Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 5: Test the Application

1. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

2. Start the development server:

   ```bash
   npm run dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)
4. Click "Continue with Google" to test the authentication flow

## Features Included

✅ **Google OAuth Integration** - Secure authentication with Google
✅ **Supabase Client Setup** - Both client and server-side configurations
✅ **Authentication Context** - React context for managing auth state
✅ **Beautiful UI Components** - Modern, responsive design with Tailwind CSS
✅ **User Profile Display** - Shows user information after authentication
✅ **Error Handling** - Proper error pages and loading states
✅ **TypeScript Support** - Full type safety throughout the application
✅ **Middleware** - Automatic session management

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts          # OAuth callback handler
│   │   └── auth-code-error/page.tsx   # Error page for auth failures
│   ├── layout.tsx                     # Root layout with AuthProvider
│   └── page.tsx                       # Main page with auth components
├── components/
│   └── auth/
│       ├── google-signin-button.tsx   # Google sign-in button component
│       └── user-profile.tsx           # User profile display component
├── contexts/
│   └── auth-context.tsx               # Authentication context provider
├── lib/
│   └── supabase/
│       ├── client.ts                  # Client-side Supabase client
│       └── server.ts                  # Server-side Supabase client
└── middleware.ts                      # Next.js middleware for auth
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**

   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check that the Supabase redirect URL is correctly configured

2. **"Client ID not found" error**

   - Verify your Google OAuth credentials are correct
   - Ensure the Google+ API is enabled in Google Cloud Console

3. **Environment variables not loading**

   - Make sure `.env.local` is in the root directory
   - Restart your development server after adding environment variables

4. **CORS errors**
   - Add your domain to the allowed origins in Supabase dashboard
   - Check that your redirect URLs are properly configured

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service role key secure and never expose it to the client
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys and secrets
