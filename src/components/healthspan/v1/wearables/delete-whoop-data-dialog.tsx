"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2, Database } from "lucide-react";
import {
  useWhoopDelete,
  type DeleteDataTypes,
  type WhoopDataCounts,
} from "@/hooks/use-whoop-delete";
import { cn } from "@/lib/utils";

interface DeleteWhoopDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DATA_TYPE_LABELS = {
  recovery: "Recovery Data",
  cycles: "Cycle Data",
  sleep: "Sleep Data",
  workouts: "Workout Data",
};

const DATA_TYPE_DESCRIPTIONS = {
  recovery: "HRV, resting heart rate, recovery scores",
  cycles: "Daily strain, heart rate, energy expenditure",
  sleep: "Sleep stages, performance, efficiency metrics",
  workouts: "Exercise sessions, heart rate zones, performance",
};

export function DeleteWhoopDataDialog({
  open,
  onOpenChange,
  onSuccess,
}: DeleteWhoopDataDialogProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<DeleteDataTypes[]>(
    []
  );
  const [preserveConnection, setPreserveConnection] = useState(true);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [dataCounts, setDataCounts] = useState<WhoopDataCounts | null>(null);

  const { deleteData, getDataCounts, isDeleting, isLoadingCounts } =
    useWhoopDelete();

  // Load data counts when dialog opens
  useEffect(() => {
    if (open) {
      loadDataCounts();
      // Reset form when dialog opens
      setSelectedDataTypes([]);
      setPreserveConnection(true);
      setConfirmDeletion(false);
    }
  }, [open]);

  const loadDataCounts = async () => {
    const counts = await getDataCounts();
    setDataCounts(counts);
  };

  const handleDataTypeToggle = (dataType: DeleteDataTypes) => {
    setSelectedDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((type) => type !== dataType)
        : [...prev, dataType]
    );
  };

  const handleSelectAll = () => {
    if (selectedDataTypes.length === 4) {
      setSelectedDataTypes([]);
    } else {
      setSelectedDataTypes(["recovery", "cycles", "sleep", "workouts"]);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeletion || selectedDataTypes.length === 0) {
      return;
    }

    const result = await deleteData({
      dataTypes: selectedDataTypes,
      preserveConnection,
      confirmDeletion: true,
    });

    if (result.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const totalRecordsToDelete = selectedDataTypes.reduce((total, type) => {
    if (!dataCounts) return total;
    // Handle "all" type by summing all individual types
    if (type === "all") {
      return total + dataCounts.dataToDelete.total;
    }
    return (
      total +
      (dataCounts.dataToDelete[type as keyof typeof dataCounts.dataToDelete] ||
        0)
    );
  }, 0);

  const allTypesSelected = selectedDataTypes.length === 4;
  const canDelete = selectedDataTypes.length > 0 && confirmDeletion;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete WHOOP Data
          </DialogTitle>
          <DialogDescription>
            Select the types of WHOOP data you want to permanently delete. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Data Types Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Data Types to Delete
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoadingCounts || !dataCounts}
              >
                {allTypesSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>

            {isLoadingCounts ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(
                  Object.keys(
                    DATA_TYPE_LABELS
                  ) as (keyof typeof DATA_TYPE_LABELS)[]
                ).map((dataType) => {
                  const count = dataCounts?.dataToDelete[dataType] || 0;
                  const isSelected = selectedDataTypes.includes(dataType);

                  return (
                    <div
                      key={dataType}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        isSelected
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => handleDataTypeToggle(dataType)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleDataTypeToggle(dataType)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium cursor-pointer">
                            {DATA_TYPE_LABELS[dataType]}
                          </Label>
                          <Badge variant={count > 0 ? "default" : "secondary"}>
                            {count.toLocaleString()} records
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {DATA_TYPE_DESCRIPTIONS[dataType]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Connection Preference */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Connection Settings</Label>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <Checkbox
                checked={preserveConnection}
                onCheckedChange={(checked) =>
                  setPreserveConnection(checked === true)
                }
              />
              <div className="flex-1">
                <Label className="text-sm font-medium cursor-pointer">
                  Keep WHOOP account connected
                </Label>
                <p className="text-xs text-muted-foreground">
                  Maintain connection for future data syncing
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedDataTypes.length > 0 && dataCounts && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Deletion Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You are about to delete{" "}
                <span className="font-medium text-foreground">
                  {totalRecordsToDelete.toLocaleString()}
                </span>{" "}
                records across{" "}
                <span className="font-medium text-foreground">
                  {selectedDataTypes.length}
                </span>{" "}
                data type{selectedDataTypes.length !== 1 ? "s" : ""}.
              </p>
            </div>
          )}

          {/* Confirmation */}
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={confirmDeletion}
                  onCheckedChange={(checked) =>
                    setConfirmDeletion(checked === true)
                  }
                />
                <Label className="text-sm font-medium cursor-pointer text-red-700 dark:text-red-300">
                  I understand this action cannot be undone
                </Label>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Deleted data cannot be recovered. You will need to re-sync from
                WHOOP to restore data.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting
              ? "Deleting..."
              : `Delete ${
                  selectedDataTypes.length > 0
                    ? `(${totalRecordsToDelete.toLocaleString()})`
                    : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Cursor rules applied correctly.
