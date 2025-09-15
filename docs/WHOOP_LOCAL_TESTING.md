# WHOOP Integration - Local Development Testing Guide

This guide provides step-by-step instructions for testing the WHOOP integration in your local development environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [WHOOP Developer Portal Configuration](#whoop-developer-portal-configuration)
5. [ngrok Setup for Webhooks](#ngrok-setup-for-webhooks)
6. [Testing the OAuth Flow](#testing-the-oauth-flow)
7. [Testing Data Synchronization](#testing-data-synchronization)
8. [Testing Webhooks](#testing-webhooks)
9. [Using the Debug Page](#using-the-debug-page)
10. [Common Issues & Solutions](#common-issues--solutions)
11. [Testing Checklist](#testing-checklist)

## Prerequisites

### Required Tools

- **Node.js 18+** with Bun package manager
- **PostgreSQL** database running locally
- **ngrok** account and CLI (for webhook testing)
- **WHOOP account** with a connected device and data
- **WHOOP Developer Account** access

### Required Accounts

- WHOOP Developer Portal account
- ngrok account (free tier works fine)
- WorkOS account (for authentication)

## Environment Setup

### 1. Install Dependencies

```bash
# Install project dependencies
bun install

# Install ngrok globally
npm install -g ngrok
# OR download from https://ngrok.com/download
```

### 2. Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uara_db"
DIRECT_URL="postgresql://username:password@localhost:5432/uara_db"

# WorkOS Authentication
WORKOS_API_KEY="your_workos_api_key"
WORKOS_CLIENT_ID="your_workos_client_id"
WORKOS_COOKIE_PASSWORD="your_32_character_cookie_password"
WORKOS_REDIRECT_URI="http://localhost:3000/callback"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# WHOOP OAuth Credentials (from WHOOP Developer Portal)
WHOOP_CLIENT_ID="01073444-3a67-4a04-acda-20295b0a145c"
WHOOP_CLIENT_SECRET="6287da0e4ce4d73f8d00987de495fa34354c99d92744495def9eceabff906ef6"

# WHOOP Configuration
WHOOP_REDIRECT_URI="http://localhost:3000/api/wearables/whoop/callback"
WHOOP_WEBHOOK_SECRET="your_webhook_secret_here"
```

## Database Setup

### 1. Run Database Migration

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database (creates tables)
bun run db:push

# Verify tables were created
psql $DATABASE_URL -c "\dt"
```

### 2. Verify WHOOP Tables

Check that these tables were created:

- `whoop_users`
- `whoop_oauth_states`
- `whoop_recovery`
- `whoop_cycles`
- `whoop_sleep`
- `whoop_workouts`

```sql
-- Check table structure
\d whoop_users
\d whoop_recovery
\d whoop_cycles
\d whoop_sleep
\d whoop_workouts
```

## WHOOP Developer Portal Configuration

### 1. Create WHOOP Application

1. Go to [developer.whoop.com](https://developer.whoop.com)
2. Create a new application with these settings:

```
Application Name: Uara.ai Local Development
Description: Local development testing for health platform
Website: http://localhost:3000
```

### 2. Configure OAuth Settings

```
Redirect URIs:
✅ http://localhost:3000/api/wearables/whoop/callback

Scopes (select all):
✅ read:recovery
✅ read:cycles
✅ read:workout
✅ read:sleep
✅ read:profile
✅ read:body_measurement
```

### 3. Note Your Credentials

Copy these values to your `.env.local`:

- **Client ID** → `WHOOP_CLIENT_ID`
- **Client Secret** → `WHOOP_CLIENT_SECRET`

## ngrok Setup for Webhooks

### 1. Install and Authenticate ngrok

```bash
# Install ngrok (if not already installed)
npm install -g ngrok

# Authenticate with your ngrok token
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

### 2. Start ngrok Tunnel

```bash
# Start ngrok tunnel for local development server
ngrok http 3000
```

You'll see output like:

```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Important**: Keep this terminal running during development!

### 3. Update WHOOP Webhook Settings

1. Go to your WHOOP application in the developer portal
2. Navigate to **Webhooks** section
3. Add webhook configuration:

```
Webhook URL: https://abc123.ngrok.io/api/wearables/whoop/webhook
API Version: v2
Secret: your_webhook_secret_here

Event Types (select all):
✅ user.updated
✅ recovery.updated
✅ cycle.updated
✅ sleep.updated
✅ workout.updated
✅ body_measurement.updated
```

## Testing the OAuth Flow

### 1. Start Development Server

```bash
# Start the Next.js development server
bun dev

# Server should be running at http://localhost:3000
```

### 2. Test OAuth Connection

1. Navigate to the debug page: `http://localhost:3000/whoop`
2. Click **"Connect WHOOP Account"** button
3. You should be redirected to WHOOP OAuth page
4. Login with your WHOOP credentials
5. Authorize the application
6. You should be redirected back to the debug page
7. Verify connection status shows "Connected"

### 3. Verify Database Storage

```sql
-- Check if user was created
SELECT * FROM whoop_users;

-- Check OAuth state cleanup
SELECT * FROM whoop_oauth_states;
```

## Testing Data Synchronization

### 1. Manual Sync via Debug Page

1. Go to the **Data Sync** tab in the debug page
2. Configure sync parameters:
   - **Days**: Start with 7 days
   - **Type**: Select "All Data"
3. Click **"Start Sync"**
4. Monitor the sync progress in real-time
5. Check the results summary

### 2. Verify Data in Database

```sql
-- Check synced data counts
SELECT
  'recovery' as type, COUNT(*) as count FROM whoop_recovery WHERE whoop_user_id = 'your_user_id'
UNION ALL
SELECT
  'cycles' as type, COUNT(*) as count FROM whoop_cycles WHERE whoop_user_id = 'your_user_id'
UNION ALL
SELECT
  'sleep' as type, COUNT(*) as count FROM whoop_sleep WHERE whoop_user_id = 'your_user_id'
UNION ALL
SELECT
  'workouts' as type, COUNT(*) as count FROM whoop_workouts WHERE whoop_user_id = 'your_user_id';

-- Check recent recovery data
SELECT * FROM whoop_recovery
WHERE whoop_user_id = 'your_user_id'
ORDER BY created_at DESC
LIMIT 5;
```

### 3. Test API Endpoints Directly

```bash
# Test sync status endpoint
curl -H "Cookie: your_auth_cookie" \
  http://localhost:3000/api/wearables/whoop/sync

# Test manual sync
curl -X POST \
  -H "Cookie: your_auth_cookie" \
  "http://localhost:3000/api/wearables/whoop/sync?days=1&type=recovery"

# Test data retrieval
curl -H "Cookie: your_auth_cookie" \
  "http://localhost:3000/api/wearables/whoop/data?days=7&limit=10"
```

## Testing Webhooks

### 1. Verify ngrok is Running

Make sure your ngrok tunnel is active and the URL matches your WHOOP webhook configuration.

```bash
# Check ngrok status
curl https://your-ngrok-url.ngrok.io/api/wearables/whoop/webhook
# Should return 405 Method Not Allowed (GET not supported)
```

### 2. Test Webhook Endpoint

```bash
# Test webhook with valid payload
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Whoop-Signature: sha256=test_signature" \
  -d '{
    "id": "evt_test_123",
    "type": "recovery.updated",
    "data": {
      "user_id": 12345,
      "id": 67890
    },
    "created_at": "2024-01-08T10:30:00Z"
  }' \
  https://your-ngrok-url.ngrok.io/api/wearables/whoop/webhook
```

### 3. Generate Real Webhook Events

1. **Using WHOOP App**: Complete a workout or sleep session
2. **Using Debug Page**: Use the "Webhook Test" tab to simulate events
3. **Monitor Logs**: Watch the Debug Logs tab for webhook processing

### 4. Verify Webhook Processing

```sql
-- Check if webhook data was processed
SELECT * FROM whoop_recovery
WHERE whoop_user_id = 'your_user_id'
ORDER BY updated_at DESC
LIMIT 5;
```

## Using the Debug Page

The debug page at `/whoop` provides comprehensive testing tools:

### 1. Connection Status

- **Real-time monitoring** of WHOOP connection
- **User profile information** display
- **Data counts** for all types
- **Quick connect/disconnect** functionality

### 2. Data Sync Testing

- **Manual sync triggers** with custom parameters
- **Real-time progress monitoring**
- **Error reporting and debugging**
- **Sync history tracking**

### 3. Webhook Testing

- **Simulate webhook events** with custom payloads
- **Test different event types**
- **Validate webhook processing**
- **Monitor webhook logs**

### 4. Data Inspection

- **View stored WHOOP data**
- **Export data in JSON/CSV formats**
- **Inspect raw database records**
- **Data validation and verification**

### 5. Debug Logging

- **Real-time activity logs**
- **Error tracking and debugging**
- **API call monitoring**
- **Performance metrics**

## Common Issues & Solutions

### 1. OAuth Issues

**Issue**: "Invalid redirect URI"

```bash
# Solution: Verify redirect URI matches exactly
# WHOOP Dashboard: http://localhost:3000/api/wearables/whoop/callback
# Environment: WHOOP_REDIRECT_URI="http://localhost:3000/api/wearables/whoop/callback"
```

**Issue**: "State parameter mismatch"

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM whoop_oauth_states;"

# Clear expired states
psql $DATABASE_URL -c "DELETE FROM whoop_oauth_states WHERE expires_at < NOW();"
```

### 2. Webhook Issues

**Issue**: "Webhook not receiving events"

```bash
# Verify ngrok is running
curl https://your-ngrok-url.ngrok.io/health
# Should return your app

# Check WHOOP webhook settings
# URL should be: https://your-ngrok-url.ngrok.io/api/wearables/whoop/webhook
```

**Issue**: "Invalid webhook signature"

```bash
# Verify webhook secret in environment
echo $WHOOP_WEBHOOK_SECRET

# Check WHOOP dashboard webhook secret matches
# Use same secret in both places
```

### 3. Data Sync Issues

**Issue**: "No data syncing"

```bash
# Check WHOOP account has data
# Verify you have recovery, sleep, or workout data in WHOOP app

# Check API scopes in WHOOP dashboard
# Ensure all required scopes are enabled
```

**Issue**: "Token expired errors"

```bash
# Check token expiration
psql $DATABASE_URL -c "SELECT expires_at FROM whoop_users WHERE user_id = 'your_user_id';"

# Test token refresh
curl -X POST \
  -H "Cookie: your_auth_cookie" \
  http://localhost:3000/api/wearables/whoop/sync
```

### 4. Database Issues

**Issue**: "Table doesn't exist"

```bash
# Run migration
bun run db:push

# Verify tables exist
psql $DATABASE_URL -c "\dt"
```

**Issue**: "Foreign key constraint errors"

```bash
# Check user exists first
psql $DATABASE_URL -c "SELECT id FROM users WHERE id = 'your_user_id';"

# Verify WorkOS authentication is working
```

## Testing Checklist

### Pre-Testing Setup

- [ ] Environment variables configured
- [ ] Database running and migrated
- [ ] WHOOP Developer Portal configured
- [ ] ngrok tunnel active
- [ ] Development server running

### OAuth Flow Testing

- [ ] OAuth initiation works
- [ ] WHOOP authorization succeeds
- [ ] Callback processing works
- [ ] User data stored correctly
- [ ] Error scenarios handled

### Data Sync Testing

- [ ] Manual sync completes successfully
- [ ] Different time ranges work
- [ ] Selective data type sync works
- [ ] Error handling for failures
- [ ] Database storage verification

### Webhook Testing

- [ ] Webhook endpoint accessible
- [ ] Signature verification works
- [ ] Event processing succeeds
- [ ] Real-time updates work
- [ ] Error scenarios handled

### API Endpoint Testing

- [ ] All endpoints return expected responses
- [ ] Authentication works correctly
- [ ] Error responses are appropriate
- [ ] Rate limiting behaves correctly

### Debug Page Testing

- [ ] Connection status accurate
- [ ] Manual sync functions work
- [ ] Webhook testing works
- [ ] Data viewer displays correctly
- [ ] Export functionality works
- [ ] Logs capture all activity

### Performance Testing

- [ ] Large data syncs complete
- [ ] Webhook processing is fast
- [ ] Database queries optimized
- [ ] Memory usage reasonable

## Advanced Testing Scenarios

### 1. Token Refresh Testing

```bash
# Force token expiration in database
psql $DATABASE_URL -c "UPDATE whoop_users SET expires_at = NOW() - INTERVAL '1 hour' WHERE user_id = 'your_user_id';"

# Test automatic refresh
curl -X POST \
  -H "Cookie: your_auth_cookie" \
  http://localhost:3000/api/wearables/whoop/sync
```

### 2. Error Recovery Testing

```bash
# Test with invalid webhook payloads
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Whoop-Signature: sha256=invalid" \
  -d '{"invalid": "payload"}' \
  https://your-ngrok-url.ngrok.io/api/wearables/whoop/webhook

# Test with expired OAuth codes
# (Manual testing through OAuth flow with delayed callback)
```

### 3. Load Testing

```bash
# Test multiple simultaneous sync requests
for i in {1..5}; do
  curl -X POST \
    -H "Cookie: your_auth_cookie" \
    "http://localhost:3000/api/wearables/whoop/sync?days=1" &
done
wait
```

## Monitoring and Debugging

### 1. Application Logs

```bash
# Monitor Next.js logs
tail -f .next/trace

# Monitor database queries
# Enable query logging in PostgreSQL config
```

### 2. Database Monitoring

```sql
-- Monitor active connections
SELECT * FROM pg_stat_activity WHERE datname = 'uara_db';

-- Monitor table sizes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE tablename LIKE 'whoop_%';
```

### 3. Performance Metrics

```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s \
  -H "Cookie: your_auth_cookie" \
  http://localhost:3000/api/wearables/whoop/sync

# Where curl-format.txt contains:
#      time_namelookup:  %{time_namelookup}s\n
#         time_connect:  %{time_connect}s\n
#      time_appconnect:  %{time_appconnect}s\n
#     time_pretransfer:  %{time_pretransfer}s\n
#        time_redirect:  %{time_redirect}s\n
#   time_starttransfer:  %{time_starttransfer}s\n
#                      ----------\n
#           time_total:  %{time_total}s\n
```

## Production Readiness Testing

Before deploying to production, verify:

- [ ] All environment variables configured for production
- [ ] HTTPS URLs configured in WHOOP dashboard
- [ ] Database properly secured and backed up
- [ ] Error handling robust and user-friendly
- [ ] Performance acceptable under load
- [ ] Security measures implemented
- [ ] Monitoring and alerting configured

---

This comprehensive testing guide ensures your WHOOP integration is thoroughly validated before production deployment. Follow each section systematically to catch issues early and ensure a smooth user experience.

Cursor rules applied correctly.
