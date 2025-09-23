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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Unplug, Database, Shield } from "lucide-react";
import { useWhoopDelete, type WhoopDataCounts } from "@/hooks/use-whoop-delete";

interface DisconnectWhoopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DisconnectWhoopDialog({
  open,
  onOpenChange,
  onSuccess,
}: DisconnectWhoopDialogProps) {
  const [preserveData, setPreserveData] = useState(true);
  const [confirmDisconnection, setConfirmDisconnection] = useState(false);
  const [dataCounts, setDataCounts] = useState<WhoopDataCounts | null>(null);

  const { disconnectAccount, getDataCounts, isDisconnecting, isLoadingCounts } =
    useWhoopDelete();

  // Load data counts when dialog opens
  useEffect(() => {
    if (open) {
      loadDataCounts();
      // Reset form when dialog opens
      setPreserveData(true);
      setConfirmDisconnection(false);
    }
  }, [open]);

  const loadDataCounts = async () => {
    const counts = await getDataCounts();
    setDataCounts(counts);
  };

  const handleDisconnect = async () => {
    if (!confirmDisconnection) {
      return;
    }

    const result = await disconnectAccount({
      preserveData,
      confirmDisconnection: true,
    });

    if (result.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const canDisconnect = confirmDisconnection;
  const totalRecords = dataCounts?.dataToDelete.total || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unplug className="h-5 w-5 text-orange-500" />
            Disconnect WHOOP Account
          </DialogTitle>
          <DialogDescription>
            Choose how you want to disconnect your WHOOP account. You can
            preserve your data or remove it completely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Data Summary */}
          {isLoadingCounts ? (
            <div className="h-16 bg-muted animate-pulse rounded-lg" />
          ) : (
            dataCounts && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">Current Data</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Recovery:</span>
                    <Badge variant="secondary">
                      {dataCounts.dataToDelete.recovery.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycles:</span>
                    <Badge variant="secondary">
                      {dataCounts.dataToDelete.cycles.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sleep:</span>
                    <Badge variant="secondary">
                      {dataCounts.dataToDelete.sleep.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Workouts:</span>
                    <Badge variant="secondary">
                      {dataCounts.dataToDelete.workouts.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Records:</span>
                    <Badge>{totalRecords.toLocaleString()}</Badge>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Data Preservation Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Data Handling</Label>

            <div className="space-y-3">
              {/* Preserve Data Option */}
              <div
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  preserveData
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setPreserveData(true)}
              >
                <Checkbox
                  checked={preserveData}
                  onCheckedChange={() => setPreserveData(true)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <Label className="text-sm font-medium cursor-pointer">
                      Preserve Historical Data (Recommended)
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep all your WHOOP data for future reference. Only removes
                    the connection to sync new data.
                  </p>
                </div>
              </div>

              {/* Delete Data Option */}
              <div
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  !preserveData
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setPreserveData(false)}
              >
                <Checkbox
                  checked={!preserveData}
                  onCheckedChange={() => setPreserveData(false)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Label className="text-sm font-medium cursor-pointer">
                      Delete All Data
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Permanently remove all WHOOP data and disconnect the
                    account. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              What happens next:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Your WHOOP account will be disconnected</li>
              <li>• No new data will be synced from WHOOP</li>
              {preserveData ? (
                <>
                  <li>• Your historical data will remain accessible</li>
                  <li>• You can reconnect your account anytime</li>
                </>
              ) : (
                <>
                  <li>
                    • All {totalRecords.toLocaleString()} records will be
                    permanently deleted
                  </li>
                  <li>• You&apos;ll need to re-sync if you reconnect later</li>
                </>
              )}
            </ul>
          </div>

          {/* Confirmation */}
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={confirmDisconnection}
                  onCheckedChange={(checked) =>
                    setConfirmDisconnection(checked === true)
                  }
                />
                <Label className="text-sm font-medium cursor-pointer text-orange-700 dark:text-orange-300">
                  I understand and want to disconnect my WHOOP account
                </Label>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {preserveData
                  ? "Your data will be preserved but no new data will sync."
                  : "This will permanently delete all your WHOOP data."}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDisconnecting}
          >
            Cancel
          </Button>
          <Button
            variant={preserveData ? "default" : "destructive"}
            onClick={handleDisconnect}
            disabled={!canDisconnect || isDisconnecting}
            className="min-w-[120px]"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Cursor rules applied correctly.
