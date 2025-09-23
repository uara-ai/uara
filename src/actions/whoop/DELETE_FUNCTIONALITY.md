# WHOOP Delete Data Functionality

This document describes the comprehensive delete data functionality for WHOOP wearable data in the Uara.ai application.

## 🎯 Overview

The delete functionality provides users with granular control over their WHOOP data with multiple options:

- **Selective Data Deletion**: Delete specific data types (recovery, cycles, sleep, workouts)
- **Complete Data Deletion**: Delete all WHOOP data
- **Account Disconnection**: Disconnect WHOOP account with or without data preservation
- **Data Preservation**: Keep historical data while disconnecting account

## 📁 File Structure

```
src/
├── actions/whoop/
│   ├── delete-data.ts              # Server actions for data deletion
│   └── index.ts                    # Updated exports
├── hooks/
│   └── use-whoop-delete.ts         # React hook for delete operations
└── components/healthspan/v1/wearables/
    ├── delete-whoop-data-dialog.tsx    # Delete data dialog component
    ├── disconnect-whoop-dialog.tsx      # Disconnect account dialog
    ├── whoop-delete-integration-example.tsx # Integration example
    └── delete/
        └── index.ts                     # Export barrel
```

## 🔧 Server Actions

### `deleteWhoopDataAction`

Deletes specific types of WHOOP data with preservation options.

```typescript
import { deleteWhoopDataAction } from "@/actions/whoop";

const result = await deleteWhoopDataAction({
  dataTypes: ["recovery", "sleep"], // or ["all"]
  preserveConnection: true, // Keep WHOOP account connected
  confirmDeletion: true, // Required confirmation
});
```

**Parameters:**

- `dataTypes`: Array of data types to delete (`"recovery" | "cycles" | "sleep" | "workouts" | "all"`)
- `preserveConnection`: Whether to keep WHOOP account connected (default: true)
- `confirmDeletion`: Must be true to proceed (safety check)

### `disconnectWhoopAccountAction`

Disconnects WHOOP account with optional data preservation.

```typescript
import { disconnectWhoopAccountAction } from "@/actions/whoop";

const result = await disconnectWhoopAccountAction({
  preserveData: true, // Keep historical data
  confirmDisconnection: true, // Required confirmation
});
```

**Parameters:**

- `preserveData`: Whether to preserve historical data (default: false)
- `confirmDisconnection`: Must be true to proceed (safety check)

### `getWhoopDataCountsAction`

Gets current data counts for deletion preview.

```typescript
import { getWhoopDataCountsAction } from "@/actions/whoop";

const counts = await getWhoopDataCountsAction({});
// Returns: { connected, canDelete, dataToDelete: { recovery, cycles, sleep, workouts, total } }
```

## 🪝 React Hook

### `useWhoopDelete`

Provides all delete functionality with loading states and error handling.

```typescript
import { useWhoopDelete } from "@/hooks/use-whoop-delete";

const {
  // Core functions
  deleteData,
  disconnectAccount,
  getDataCounts,

  // Helper functions
  deleteAllData,
  deleteSpecificData,
  disconnectWithDataPreservation,
  disconnectWithDataDeletion,

  // Loading states
  isDeleting,
  isDisconnecting,
  isLoadingCounts,
  isLoading,
} = useWhoopDelete();
```

**Helper Functions:**

```typescript
// Delete all data (with optional connection preservation)
await deleteAllData((preserveConnection = false));

// Delete specific data types
await deleteSpecificData(["recovery", "sleep"], (preserveConnection = true));

// Disconnect with data preservation
await disconnectWithDataPreservation();

// Disconnect with complete data deletion
await disconnectWithDataDeletion();
```

## 🎨 UI Components

### `DeleteWhoopDataDialog`

A comprehensive dialog for selective data deletion.

```typescript
import { DeleteWhoopDataDialog } from "@/components/healthspan/v1/wearables/delete-whoop-data-dialog";

<DeleteWhoopDataDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  onSuccess={() => {
    // Handle successful deletion
    refreshData();
    showSuccessMessage();
  }}
/>;
```

**Features:**

- ✅ Data type selection with counts
- ✅ Connection preservation option
- ✅ Deletion confirmation
- ✅ Real-time count loading
- ✅ Visual summary of deletion

### `DisconnectWhoopDialog`

A dialog for account disconnection with data handling options.

```typescript
import { DisconnectWhoopDialog } from "@/components/healthspan/v1/wearables/disconnect-whoop-dialog";

<DisconnectWhoopDialog
  open={isDisconnectDialogOpen}
  onOpenChange={setIsDisconnectDialogOpen}
  onSuccess={() => {
    // Handle successful disconnection
    redirectToConnectionPage();
  }}
/>;
```

**Features:**

- ✅ Data preservation vs deletion choice
- ✅ Current data summary
- ✅ Clear explanation of consequences
- ✅ Disconnection confirmation

## 🔄 Integration Example

```typescript
import { useState } from "react";
import { DeleteWhoopDataDialog, DisconnectWhoopDialog } from "@/actions/whoop";

export function WhoopManagement() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

  const handleDeleteSuccess = () => {
    // Refresh data, show success message, etc.
    window.location.reload(); // Simple approach
  };

  const handleDisconnectSuccess = () => {
    // Redirect or update UI state
    window.location.href = "/healthspan/wearables";
  };

  return (
    <>
      {/* Your existing UI */}
      <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
        Delete Data
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setIsDisconnectDialogOpen(true)}>
        Disconnect Account
      </DropdownMenuItem>

      {/* Delete Dialogs */}
      <DeleteWhoopDataDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />

      <DisconnectWhoopDialog
        open={isDisconnectDialogOpen}
        onOpenChange={setIsDisconnectDialogOpen}
        onSuccess={handleDisconnectSuccess}
      />
    </>
  );
}
```

## 🔒 Security & Safety Features

### Data Protection

- ✅ **Double Confirmation**: Users must explicitly confirm deletions
- ✅ **Granular Control**: Choose specific data types to delete
- ✅ **Connection Preservation**: Option to keep account connected
- ✅ **Data Counts**: Show exactly what will be deleted

### Transaction Safety

- ✅ **Database Transactions**: All deletions are atomic
- ✅ **Cache Invalidation**: Automatic cache clearing after deletions
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- ✅ **Rollback Protection**: Failed operations don't leave partial state

### User Experience

- ✅ **Loading States**: Clear loading indicators during operations
- ✅ **Success Feedback**: Toast notifications for completion
- ✅ **Error Messages**: Descriptive error messages
- ✅ **Progress Indication**: Real-time feedback during operations

## 📊 Data Types

### Recovery Data

- HRV (Heart Rate Variability)
- Resting heart rate
- Recovery scores
- User calibration status

### Cycle Data

- Daily strain scores
- Heart rate metrics
- Energy expenditure (kilojoules)
- Completion status

### Sleep Data

- Sleep stages and duration
- Performance and efficiency metrics
- Sleep quality indicators
- Sleep need calculations

### Workout Data

- Exercise sessions
- Heart rate zones
- Performance metrics
- Distance and altitude data

## 🚀 Performance Optimizations

### Database Efficiency

- **Indexed Queries**: Optimized database queries with proper indexing
- **Batch Operations**: Transaction-based batch deletions
- **Count Queries**: Efficient counting without full data retrieval

### Client-Side Optimization

- **SWR Integration**: Automatic cache invalidation
- **Loading States**: Prevent duplicate operations
- **Error Boundaries**: Graceful error handling

### Caching Strategy

- **Cache Invalidation**: Automatic clearing of related caches
- **Tag-Based Invalidation**: Targeted cache clearing
- **Real-time Updates**: Immediate UI updates after operations

## 🔮 Future Enhancements

### Planned Features

- **Scheduled Deletions**: Set up automatic data cleanup
- **Data Export Before Deletion**: Backup data before removal
- **Selective Date Range Deletion**: Delete data for specific time periods
- **Audit Logging**: Track deletion operations for compliance

### Advanced Options

- **Bulk Operations**: Delete data for multiple users (admin)
- **Recovery Options**: Temporary deletion with recovery period
- **Advanced Filtering**: Delete based on data quality or completeness

---

## 📝 Usage Notes

1. **Always Test First**: Test delete operations in development before production
2. **Backup Strategy**: Consider data export before large deletions
3. **User Communication**: Clearly communicate deletion consequences to users
4. **Error Handling**: Implement proper error handling in your integration
5. **Cache Management**: Ensure proper cache invalidation after deletions

**Cursor rules applied correctly.**
