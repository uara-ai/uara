# WHOOP API Integration - Enhanced Version

## Overview

This enhanced WHOOP API integration provides efficient, type-safe access to WHOOP wearable data with improved database schema, timeline-based queries, and individual data type endpoints.

## 🎯 Key Improvements

### 1. **Enhanced Database Schema**

- ✅ Added missing fields from WHOOP API (sleep need metrics, heart rate zones, etc.)
- ✅ Improved indexing for better query performance
- ✅ Better data type alignment with WHOOP API v2

### 2. **Timeline-Based API Routes**

- ✅ Standardized timeline periods: `1d`, `3d`, `1w`, `2w`, `1m`, `2m`
- ✅ Efficient date range calculations
- ✅ Configurable pagination limits per timeline

### 3. **Individual Data Type APIs**

- ✅ Separate endpoints for each data type (sleep, recovery, cycles, workouts)
- ✅ Type-specific filtering and sorting
- ✅ CSV export capabilities

### 4. **Better Business Logic**

- ✅ Updated callback redirect to `/healthspan/wearables`
- ✅ Improved error handling and validation
- ✅ Standardized response formats

## 📚 API Endpoints

### Authentication & Connection

```
GET  /api/wearables/whoop/auth          # Initiate OAuth connection
GET  /api/wearables/whoop/callback      # OAuth callback (redirects to /healthspan/wearables)
GET  /api/wearables/whoop/disconnect    # Check disconnect status
DELETE /api/wearables/whoop/disconnect  # Disconnect WHOOP account
```

### Data Management

```
POST /api/wearables/whoop/sync          # Manual data sync
GET  /api/wearables/whoop/sync          # Check sync status
POST /api/wearables/whoop/refresh       # Refresh cache
```

### Individual Data Types

```
GET /api/wearables/whoop/sleep          # Sleep data with advanced filtering
GET /api/wearables/whoop/recovery       # Recovery scores and HRV data
GET /api/wearables/whoop/cycles         # Daily cycles and strain data
GET /api/wearables/whoop/workouts       # Workout data with heart rate zones
```

### Timeline-Based Data

```
GET /api/wearables/whoop/timeline/1d    # Last day - all data types
GET /api/wearables/whoop/timeline/3d    # Last 3 days
GET /api/wearables/whoop/timeline/1w    # Last week
GET /api/wearables/whoop/timeline/2w    # Last 2 weeks
GET /api/wearables/whoop/timeline/1m    # Last month
GET /api/wearables/whoop/timeline/2m    # Last 2 months
```

### Legacy Endpoints (Enhanced)

```
GET /api/wearables/whoop/data           # Raw data access
GET /api/wearables/whoop/export         # Data export
GET /api/wearables/whoop/stats          # Processed statistics
GET /api/wearables/whoop/summary        # Summary data
```

## 🔧 Usage Examples

### 1. Sleep Data with Filtering

```javascript
// Get last week's sleep data, excluding naps
const response = await fetch(
  "/api/wearables/whoop/sleep?timeline=1w&nap=false&scoreState=SCORED"
);
const sleepData = await response.json();

// Response includes formatted data with hours conversion
console.log(sleepData.data[0].totalInBedTimeHours); // Sleep duration in hours
```

### 2. Recovery Trends

```javascript
// Get recovery scores above 70% for last month
const response = await fetch(
  "/api/wearables/whoop/recovery?timeline=1m&minScore=70"
);
const recoveryData = await response.json();

// Includes pagination metadata
console.log(recoveryData.metadata.pagination.hasMore);
```

### 3. Workout Analysis

```javascript
// Get running workouts (sport ID varies) with CSV export
const response = await fetch(
  "/api/wearables/whoop/workouts?timeline=1m&sportId=1&format=csv"
);
const csvData = await response.text(); // CSV format
```

### 4. Timeline Overview

```javascript
// Get all data types for last 2 weeks
const response = await fetch("/api/wearables/whoop/timeline/2w");
const timelineData = await response.json();

// Access different data types
const { sleep, recovery, cycles, workouts } = timelineData.data;
```

### 5. Specific Data Types Only

```javascript
// Get only sleep and recovery data for last week
const response = await fetch(
  "/api/wearables/whoop/timeline/1w?types=sleep,recovery"
);
const data = await response.json();
```

## 📊 Query Parameters

### Common Parameters (All Endpoints)

- `timeline`: `1d` | `3d` | `1w` | `2w` | `1m` | `2m` (default: `1w`)
- `page`: Page number for pagination (default: `1`)
- `limit`: Items per page (default: `50`, max varies by timeline)
- `scoreState`: `SCORED` | `PENDING_SCORE` | `UNSCORABLE` (optional)
- `format`: `json` | `csv` (default: `json`)

### Sleep-Specific Parameters

- `nap`: `true` | `false` - Filter by nap vs main sleep

### Recovery-Specific Parameters

- `minScore`: Minimum recovery score (0-100)
- `maxScore`: Maximum recovery score (0-100)

### Cycle-Specific Parameters

- `minStrain`: Minimum strain score (0-21)
- `maxStrain`: Maximum strain score (0-21)
- `completed`: `true` | `false` - Filter by completed cycles

### Workout-Specific Parameters

- `sportId`: Specific sport ID to filter by
- `minStrain`: Minimum strain score (0-21)
- `maxStrain`: Maximum strain score (0-21)
- `minDuration`: Minimum duration in minutes
- `maxDuration`: Maximum duration in minutes

### Timeline-Specific Parameters

- `types`: Comma-separated data types (`sleep,recovery,cycles,workouts`) or `all`

## 📈 Response Format

All endpoints return standardized responses:

```typescript
{
  success: boolean;
  data: DataType[];
  metadata: {
    timeline: string;
    period: {
      start: string;
      end: string;
      days: number;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    counts: {
      total: number;
      scored: number;
      pending: number;
      unscorable: number;
    };
    generatedAt: string;
  };
}
```

## 🗄️ Database Schema Changes

### New Fields Added

#### WhoopSleep

- `totalNoDataTime` - No data time in milliseconds
- `sleepNeedBaseline` - Baseline sleep need in milliseconds
- `sleepNeedFromDebt` - Sleep need from debt in milliseconds
- `sleepNeedFromStrain` - Sleep need from strain in milliseconds
- `sleepNeedFromNap` - Sleep need from nap in milliseconds

#### WhoopWorkout

- `zoneZeroDuration` - Zone 0 duration in milliseconds
- `zoneOneDuration` - Zone 1 duration in milliseconds
- `zoneTwoDuration` - Zone 2 duration in milliseconds
- `zoneThreeDuration` - Zone 3 duration in milliseconds
- `zoneFourDuration` - Zone 4 duration in milliseconds
- `zoneFiveDuration` - Zone 5 duration in milliseconds

### New Indexes Added

- Score state indexes on all data types for faster filtering
- Sport ID index on workouts for activity filtering
- Nap index on sleep for main sleep vs nap filtering
- Recovery score index for range queries
- Strain indexes for performance filtering

## 🚀 Performance Optimizations

1. **Database Indexing**: Strategic indexes for common query patterns
2. **Timeline Limits**: Different pagination limits based on timeline scope
3. **Field Selection**: Only fetch necessary fields for each endpoint
4. **BigInt Serialization**: Proper handling of large cycle IDs
5. **CSV Streaming**: Efficient CSV generation for large datasets

## 🔒 Security & Validation

- ✅ Comprehensive parameter validation
- ✅ Timeline and score state validation
- ✅ Pagination limits enforcement
- ✅ User authentication on all endpoints
- ✅ WHOOP connection verification

## 🧪 Testing

Test the enhanced API with curl:

```bash
# Get last week's sleep data
curl -H "Authorization: Bearer $TOKEN" \
  "https://yourapp.com/api/wearables/whoop/sleep?timeline=1w"

# Get recovery data with filtering
curl -H "Authorization: Bearer $TOKEN" \
  "https://yourapp.com/api/wearables/whoop/recovery?timeline=1m&minScore=60"

# Get timeline overview
curl -H "Authorization: Bearer $TOKEN" \
  "https://yourapp.com/api/wearables/whoop/timeline/2w?types=sleep,recovery"
```

## 🔄 Migration Notes

When updating to this enhanced version:

1. **Database Migration**: Run Prisma migrations to add new fields and indexes
2. **API Updates**: Update frontend calls to use new timeline parameters
3. **Response Handling**: Update response parsing for new metadata format
4. **Error Handling**: Update error handling for new validation responses

## 📝 Future Enhancements

Potential improvements for future versions:

- Real-time webhook processing for instant data updates
- Data aggregation endpoints for trends and analytics
- GraphQL endpoints for flexible data fetching
- Rate limiting and caching optimizations
- Advanced filtering with date ranges and custom periods

---

**Note**: This enhanced WHOOP API integration follows the business logic requirement to redirect users to `/healthspan/wearables` after successful connection and provides comprehensive data access with efficient timeline-based querying.
