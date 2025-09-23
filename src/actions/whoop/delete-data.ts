"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidateTag } from "next/cache";

// Input schema for delete operations
const deleteDataSchema = z.object({
  dataTypes: z
    .array(z.enum(["recovery", "cycles", "sleep", "workouts", "all"]))
    .min(1, "At least one data type must be selected"),
  preserveConnection: z.boolean().default(true),
  confirmDeletion: z.boolean().refine((val) => val === true, {
    message: "You must confirm the deletion",
  }),
});

const disconnectSchema = z.object({
  preserveData: z.boolean().default(false),
  confirmDisconnection: z.boolean().refine((val) => val === true, {
    message: "You must confirm the disconnection",
  }),
});

// Delete specific WHOOP data types
export const deleteWhoopDataAction = actionClient
  .schema(deleteDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { dataTypes, preserveConnection, confirmDeletion } = parsedInput;

    if (!confirmDeletion) {
      throw new Error("Deletion must be confirmed");
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { id: true, whoopUserId: true },
    });

    if (!whoopUser) {
      throw new Error("WHOOP account not connected");
    }

    try {
      // Get data counts before deletion for reporting
      const [recoveryCount, cycleCount, sleepCount, workoutCount] =
        await Promise.all([
          prisma.whoopRecovery.count({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopCycle.count({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopSleep.count({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopWorkout.count({
            where: { whoopUserId: user.id },
          }),
        ]);

      const deletionOperations = [];
      const deletedCounts = {
        recovery: 0,
        cycles: 0,
        sleep: 0,
        workouts: 0,
      };

      // Build deletion operations based on requested data types
      if (dataTypes.includes("all") || dataTypes.includes("recovery")) {
        deletionOperations.push(
          prisma.whoopRecovery.deleteMany({
            where: { whoopUserId: user.id },
          })
        );
        deletedCounts.recovery = recoveryCount;
      }

      if (dataTypes.includes("all") || dataTypes.includes("cycles")) {
        deletionOperations.push(
          prisma.whoopCycle.deleteMany({
            where: { whoopUserId: user.id },
          })
        );
        deletedCounts.cycles = cycleCount;
      }

      if (dataTypes.includes("all") || dataTypes.includes("sleep")) {
        deletionOperations.push(
          prisma.whoopSleep.deleteMany({
            where: { whoopUserId: user.id },
          })
        );
        deletedCounts.sleep = sleepCount;
      }

      if (dataTypes.includes("all") || dataTypes.includes("workouts")) {
        deletionOperations.push(
          prisma.whoopWorkout.deleteMany({
            where: { whoopUserId: user.id },
          })
        );
        deletedCounts.workouts = workoutCount;
      }

      // If not preserving connection and deleting all data, remove user record
      if (!preserveConnection && dataTypes.includes("all")) {
        deletionOperations.push(
          prisma.whoopUser.delete({
            where: { userId: user.id },
          })
        );
      }

      // Execute all deletions in a transaction
      await prisma.$transaction(deletionOperations);

      // Invalidate caches
      revalidateTag("whoop-data");
      revalidateTag("wearables");
      revalidateTag("sleep");

      const totalDeleted = Object.values(deletedCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      return {
        success: true,
        message: `Successfully deleted ${totalDeleted} WHOOP records`,
        deletedCounts,
        connectionPreserved: preserveConnection,
        totalDeleted,
      };
    } catch (error) {
      console.error("Error deleting WHOOP data:", error);
      throw new Error("Failed to delete WHOOP data");
    }
  });

// Disconnect WHOOP account (uses existing API logic)
export const disconnectWhoopAccountAction = actionClient
  .schema(disconnectSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { preserveData, confirmDisconnection } = parsedInput;

    if (!confirmDisconnection) {
      throw new Error("Disconnection must be confirmed");
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { whoopUserId: true },
    });

    if (!whoopUser) {
      throw new Error("WHOOP account not connected");
    }

    try {
      if (preserveData) {
        // Only remove authentication data, keep historical health data
        await prisma.whoopUser.update({
          where: { userId: user.id },
          data: {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            disconnectedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          message: "WHOOP account disconnected, historical data preserved",
          dataPreserved: true,
        };
      } else {
        // Remove all WHOOP data for the user
        await prisma.$transaction([
          prisma.whoopRecovery.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopCycle.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopSleep.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopWorkout.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopUser.delete({
            where: { userId: user.id },
          }),
        ]);

        // Invalidate caches
        revalidateTag("whoop-data");
        revalidateTag("wearables");
        revalidateTag("sleep");

        return {
          success: true,
          message: "WHOOP account disconnected and all data removed",
          dataPreserved: false,
        };
      }
    } catch (error) {
      console.error("Error disconnecting WHOOP account:", error);
      throw new Error("Failed to disconnect WHOOP account");
    }
  });

// Get data counts for deletion preview
export const getWhoopDataCountsAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        whoopUserId: true,
        accessToken: true,
        disconnectedAt: true,
        createdAt: true,
      },
    });

    if (!whoopUser) {
      return {
        connected: false,
        canDelete: false,
        dataToDelete: {
          recovery: 0,
          cycles: 0,
          sleep: 0,
          workouts: 0,
          total: 0,
        },
      };
    }

    // Get data counts
    const [recoveryCount, cycleCount, sleepCount, workoutCount] =
      await Promise.all([
        prisma.whoopRecovery.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopCycle.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopSleep.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopWorkout.count({
          where: { whoopUserId: user.id },
        }),
      ]);

    const totalRecords = recoveryCount + cycleCount + sleepCount + workoutCount;

    return {
      connected: !!whoopUser.accessToken,
      canDelete: true,
      isDisconnected: !!whoopUser.disconnectedAt,
      connectedSince: whoopUser.createdAt,
      dataToDelete: {
        recovery: recoveryCount,
        cycles: cycleCount,
        sleep: sleepCount,
        workouts: workoutCount,
        total: totalRecords,
      },
    };
  });

// Server function to get data counts without auth wrapper
export async function getWhoopDataCountsServer() {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        whoopUserId: true,
        accessToken: true,
        disconnectedAt: true,
        createdAt: true,
      },
    });

    if (!whoopUser) {
      return {
        connected: false,
        canDelete: false,
        dataToDelete: {
          recovery: 0,
          cycles: 0,
          sleep: 0,
          workouts: 0,
          total: 0,
        },
      };
    }

    // Get data counts
    const [recoveryCount, cycleCount, sleepCount, workoutCount] =
      await Promise.all([
        prisma.whoopRecovery.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopCycle.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopSleep.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopWorkout.count({
          where: { whoopUserId: user.id },
        }),
      ]);

    const totalRecords = recoveryCount + cycleCount + sleepCount + workoutCount;

    return {
      connected: !!whoopUser.accessToken,
      canDelete: true,
      isDisconnected: !!whoopUser.disconnectedAt,
      connectedSince: whoopUser.createdAt,
      dataToDelete: {
        recovery: recoveryCount,
        cycles: cycleCount,
        sleep: sleepCount,
        workouts: workoutCount,
        total: totalRecords,
      },
    };
  } catch (error) {
    console.error("Error fetching WHOOP data counts:", error);
    return null;
  }
}

// Cursor rules applied correctly.
