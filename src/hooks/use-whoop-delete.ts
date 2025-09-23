"use client";

import { useState } from "react";
import {
  deleteWhoopDataAction,
  disconnectWhoopAccountAction,
  getWhoopDataCountsAction,
} from "@/actions/whoop";
import { toast } from "sonner";

// Types for delete operations
export type DeleteDataTypes =
  | "recovery"
  | "cycles"
  | "sleep"
  | "workouts"
  | "all";

export interface DeleteOptions {
  dataTypes: DeleteDataTypes[];
  preserveConnection: boolean;
  confirmDeletion: boolean;
}

export interface DisconnectOptions {
  preserveData: boolean;
  confirmDisconnection: boolean;
}

export interface WhoopDataCounts {
  connected: boolean;
  canDelete: boolean;
  isDisconnected?: boolean;
  connectedSince?: Date;
  dataToDelete: {
    recovery: number;
    cycles: number;
    sleep: number;
    workouts: number;
    total: number;
  };
}

// Hook for WHOOP data deletion operations
export function useWhoopDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Delete WHOOP data
  const deleteData = async (options: DeleteOptions) => {
    if (!options.confirmDeletion) {
      toast.error("Please confirm the deletion");
      return { success: false };
    }

    setIsDeleting(true);
    try {
      const result = await deleteWhoopDataAction(options);

      if (result?.data?.success) {
        const { deletedCounts, totalDeleted, message } = result.data;

        toast.success(message, {
          description: `Deleted ${totalDeleted} records across ${
            Object.keys(deletedCounts).filter(
              (key) => deletedCounts[key as keyof typeof deletedCounts] > 0
            ).length
          } data types`,
        });

        return {
          success: true,
          data: result.data,
        };
      } else {
        const errorMessage = result?.serverError || "Failed to delete data";
        toast.error("Delete failed", {
          description: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Delete failed", {
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  // Disconnect WHOOP account
  const disconnectAccount = async (options: DisconnectOptions) => {
    if (!options.confirmDisconnection) {
      toast.error("Please confirm the disconnection");
      return { success: false };
    }

    setIsDisconnecting(true);
    try {
      const result = await disconnectWhoopAccountAction(options);

      if (result?.data?.success) {
        const { message, dataPreserved } = result.data;

        toast.success("WHOOP account disconnected", {
          description: dataPreserved
            ? "Your historical data has been preserved"
            : "All data has been permanently removed",
        });

        return {
          success: true,
          data: result.data,
        };
      } else {
        const errorMessage =
          result?.serverError || "Failed to disconnect account";
        toast.error("Disconnection failed", {
          description: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Disconnection failed", {
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Get data counts for deletion preview
  const getDataCounts = async (): Promise<WhoopDataCounts | null> => {
    setIsLoadingCounts(true);
    try {
      const result = await getWhoopDataCountsAction({});

      if (result?.data) {
        return result.data as WhoopDataCounts;
      } else {
        const errorMessage =
          result?.serverError || "Failed to fetch data counts";
        toast.error("Failed to load data counts", {
          description: errorMessage,
        });
        return null;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to load data counts", {
        description: errorMessage,
      });
      return null;
    } finally {
      setIsLoadingCounts(false);
    }
  };

  // Helper functions for common operations
  const deleteAllData = (preserveConnection: boolean = false) => {
    return deleteData({
      dataTypes: ["all"],
      preserveConnection,
      confirmDeletion: true,
    });
  };

  const deleteSpecificData = (
    dataTypes: DeleteDataTypes[],
    preserveConnection: boolean = true
  ) => {
    return deleteData({
      dataTypes,
      preserveConnection,
      confirmDeletion: true,
    });
  };

  const disconnectWithDataPreservation = () => {
    return disconnectAccount({
      preserveData: true,
      confirmDisconnection: true,
    });
  };

  const disconnectWithDataDeletion = () => {
    return disconnectAccount({
      preserveData: false,
      confirmDisconnection: true,
    });
  };

  return {
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

    // Computed state
    isLoading: isDeleting || isDisconnecting || isLoadingCounts,
  };
}

// Cursor rules applied correctly.
