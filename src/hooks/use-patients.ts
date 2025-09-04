"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PatientList } from "@/packages/db/patient/types";
import { getDoctorData } from "@/packages/auth/roles/doctor/functions";
import { getPatientsList } from "@/packages/db/patient/functions";

interface UsePatientsState {
  patients: PatientList[];
  isLoading: boolean;
  error: string | null;
}

interface UsePatientsReturn extends UsePatientsState {
  refreshPatients: () => Promise<void>;
  filteredPatients: (query: string) => PatientList[];
}

// Global cache to share data between components
let globalPatientsCache: {
  patients: PatientList[];
  timestamp: number;
  doctorId: number | null;
} = {
  patients: [],
  timestamp: 0,
  doctorId: null,
};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Set of refresh listeners for real-time updates
const refreshListeners = new Set<() => void>();

export function usePatients(): UsePatientsReturn {
  const [state, setState] = useState<UsePatientsState>({
    patients: globalPatientsCache.patients,
    isLoading: false,
    error: null,
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const refreshPatients = useCallback(async (force = false) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const doctorData = await getDoctorData();
      if (!doctorData) {
        throw new Error("Doctor data not found");
      }

      const currentTime = Date.now();
      const isCacheValid =
        globalPatientsCache.doctorId === doctorData.idDoctor &&
        currentTime - globalPatientsCache.timestamp < CACHE_EXPIRY_MS;

      // Use cache if valid and not forced refresh
      if (isCacheValid && !force) {
        setState({
          patients: globalPatientsCache.patients,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Fetch fresh data
      const patientsList = await getPatientsList(doctorData.idDoctor);
      const patientsData = patientsList as PatientList[];

      // Update global cache
      globalPatientsCache = {
        patients: patientsData,
        timestamp: currentTime,
        doctorId: doctorData.idDoctor,
      };

      setState({
        patients: patientsData,
        isLoading: false,
        error: null,
      });

      // Notify all listeners about the update
      refreshListeners.forEach((listener) => listener());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error refreshing patients:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const filteredPatients = useCallback(
    (query: string): PatientList[] => {
      if (!query.trim()) return state.patients;

      const searchLower = query.toLowerCase();
      return state.patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchLower) ||
          patient.CF.toLowerCase().includes(searchLower)
      );
    },
    [state.patients]
  );

  // Listen for global refresh events
  useEffect(() => {
    const listener = () => {
      setState((prev) => ({
        ...prev,
        patients: globalPatientsCache.patients,
      }));
    };

    refreshListeners.add(listener);
    return () => {
      refreshListeners.delete(listener);
    };
  }, []);

  // Auto-refresh on mount if cache is expired
  useEffect(() => {
    const currentTime = Date.now();
    const isCacheExpired =
      currentTime - globalPatientsCache.timestamp > CACHE_EXPIRY_MS;

    if (isCacheExpired || globalPatientsCache.patients.length === 0) {
      refreshPatients();
    }
  }, [refreshPatients]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = refreshTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    ...state,
    refreshPatients: () => refreshPatients(true),
    filteredPatients,
  };
}

// Utility function to manually invalidate cache (useful after adding new patients)
export function invalidatePatientsCache(): void {
  globalPatientsCache.timestamp = 0;
  refreshListeners.forEach((listener) => listener());
}

// Utility function to trigger refresh across all components
export function refreshAllPatients(): void {
  refreshListeners.forEach((listener) => listener());
}
