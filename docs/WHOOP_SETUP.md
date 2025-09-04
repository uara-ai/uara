# Whoop Integration Setup

This guide explains how to set up the Whoop integration for Uara.ai to fetch user health data.

## Prerequisites

1. A Whoop Developer account
2. Access to the Whoop Developer Dashboard
3. Your application deployed with HTTPS (required for OAuth)

## Setup Steps

### 1. Register Your Application with Whoop

1. Go to [developer.whoop.com](https://developer.whoop.com)
2. Create a developer account or log in
3. Create a new application
4. Note down your `Client ID` and `Client Secret`

### 2. Configure OAuth Settings

In your Whoop Developer Dashboard:

1. **Redirect URI**: Set this to your callback endpoint:

   - Development: `http://localhost:3000/api/whoop/callback`
   - Production: `https://yourdomain.com/api/whoop/callback`

2. **Scopes**: Enable the following scopes:
   - `read:recovery` - Recovery data
   - `read:cycles` - Daily physiological cycles
   - `read:workout` - Workout data
   - `read:sleep` - Sleep data
   - `read:profile` - User profile information
   - `read:body_measurement` - Body measurements

### 3. Configure Webhooks

1. In the Whoop Developer Dashboard, go to Webhooks
2. Set your webhook URL:
   - Development: `http://localhost:3000/api/whoop/webhook` (use ngrok for testing)
   - Production: `https://yourdomain.com/api/whoop/webhook`
3. Select API version: **v2**
4. Enable the following event types:
   - `user.updated`
   - `recovery.updated`
   - `cycle.updated`
   - `sleep.updated`
   - `workout.updated`
   - `body_measurement.updated`

### 4. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Whoop OAuth Credentials
WHOOP_CLIENT_ID=your_client_id_here
WHOOP_CLIENT_SECRET=your_client_secret_here

# Optional: Custom redirect URI (defaults to /api/whoop/callback)
WHOOP_REDIRECT_URI=https://yourdomain.com/api/whoop/callback

# Optional: Webhook secret (defaults to using client secret)
WHOOP_WEBHOOK_SECRET=your_webhook_secret_here
```

### 5. Database Migration

Run the Prisma migration to create the Whoop-related tables:

```bash
# Generate Prisma client with new schema
bun run db:generate

# Push schema changes to database
bun run db:push
```

### 6. Testing the Integration

1. **OAuth Flow**:

   - Use the `WhoopConnectButton` component in your app
   - User clicks "Connect Whoop" → redirects to Whoop OAuth
   - User authorizes → redirects back to your app with success

2. **Webhook Testing**:
   - Use ngrok for local webhook testing: `ngrok http 3000`
   - Update your webhook URL in Whoop dashboard to the ngrok URL
   - Generate test data in your Whoop app to trigger webhooks

## API Endpoints

### OAuth Callback

- **URL**: `/api/whoop/callback`
- **Method**: GET
- **Purpose**: Handles OAuth authorization code exchange and initial data sync

### Webhook Receiver

- **URL**: `/api/whoop/webhook`
- **Method**: POST
- **Purpose**: Receives real-time updates from Whoop
- **Security**: Verifies HMAC signature using your client secret

## Usage in Components

```tsx
import { WhoopConnectButton } from "@/components/whoop/whoop-connect-button";

export function SettingsPage() {
  return (
    <div>
      <h2>Connect Your Devices</h2>
      <WhoopConnectButton userId={user.id} />
    </div>
  );
}
```

## Data Storage

The integration stores the following data:

- **User Profile**: Basic Whoop user information
- **Recovery Data**: Daily recovery scores, HRV, resting heart rate
- **Cycle Data**: Daily physiological cycles and strain
- **Sleep Data**: Sleep stages, efficiency, and performance metrics
- **Workout Data**: Exercise sessions with heart rate zones and strain
- **Body Measurements**: Height, weight, and max heart rate updates

## Security Features

- **Token Management**: Automatic token refresh when expired
- **Webhook Verification**: HMAC signature validation for all webhook requests
- **State Parameter**: CSRF protection for OAuth flow
- **Secure Storage**: Encrypted token storage in database

## Troubleshooting

### Common Issues

1. **"Missing Whoop OAuth credentials"**

   - Ensure `WHOOP_CLIENT_ID` and `WHOOP_CLIENT_SECRET` are set

2. **"Invalid signature" webhook errors**

   - Verify your webhook secret matches the one in Whoop dashboard
   - Check that your webhook URL is accessible via HTTPS

3. **"Token refresh failed"**

   - User may need to re-authorize the application
   - Check that your OAuth scopes haven't changed

4. **"No user data found"**
   - Ensure the user has completed the OAuth flow
   - Check that webhook events are being processed

### Logs

Monitor the following logs for debugging:

- OAuth callback: Check server logs during authorization
- Webhook events: Monitor webhook processing logs
- Token refresh: Watch for automatic token renewal logs

## Rate Limits

Whoop API has rate limits:

- Be mindful of API call frequency
- Webhooks provide real-time updates, reducing need for polling
- Use pagination for large data requests

## Production Considerations

1. **HTTPS Required**: Whoop requires HTTPS for all OAuth and webhook URLs
2. **Webhook Reliability**: Implement proper error handling and retries
3. **Data Sync**: Consider implementing periodic full sync for data consistency
4. **User Privacy**: Ensure compliance with data protection regulations

Cursor rules applied correctly.
