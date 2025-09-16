"use client";

import * as React from "react";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconDownload,
  IconRefresh,
  IconActivity,
  IconMoon,
  IconHeart,
  IconBarbell,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  WhoopDataResponse,
  getWhoopDataAction,
} from "@/actions/whoop-data-action";

// WHOOP data types based on our database schema
interface WhoopRecoveryRecord {
  id: string;
  cycleId: string;
  sleepId: string;
  recoveryScore: number | null;
  restingHeartRate: number | null;
  hrvRmssd: number | null;
  userCalibrating: boolean | null;
  scoreState: string;
  createdAt: string;
  updatedAt: string;
  type: "recovery";
}

interface WhoopSleepRecord {
  id: string;
  sleepId: string;
  start: string;
  end: string;
  nap: boolean;
  sleepPerformancePercentage: number | null;
  sleepEfficiencyPercentage: number | null;
  sleepConsistencyPercentage: number | null;
  totalInBedTime: number | null;
  totalAwakeTime: number | null;
  totalLightSleepTime: number | null;
  totalSlowWaveSleepTime: number | null;
  totalRemSleepTime: number | null;
  respiratoryRate: number | null;
  scoreState: string;
  createdAt: string;
  type: "sleep";
}

interface WhoopCycleRecord {
  id: string;
  cycleId: string;
  start: string;
  end: string | null;
  strain: number | null;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  kilojoule: number | null;
  percentRecorded: number | null;
  scoreState: string;
  createdAt: string;
  type: "cycle";
}

interface WhoopWorkoutRecord {
  id: string;
  workoutId: string;
  start: string;
  end: string;
  sportId: number | null;
  strain: number | null;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  kilojoule: number | null;
  distanceMeters: number | null;
  scoreState: string;
  createdAt: string;
  type: "workout";
}

type WhoopRecord =
  | WhoopRecoveryRecord
  | WhoopSleepRecord
  | WhoopCycleRecord
  | WhoopWorkoutRecord;

interface WhoopTableProps {
  initialData?: WhoopDataResponse | null;
}

const formatTime = (milliseconds: number | null): string => {
  if (!milliseconds) return "N/A";
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDate = (dateString: string): React.ReactNode => {
  const date = new Date(dateString);
  const dayMonth = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="text-xs w-fit">
        {dayMonth}
      </Badge>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "recovery":
      return <IconHeart className="h-4 w-4 text-red-500" />;
    case "sleep":
      return <IconMoon className="h-4 w-4 text-blue-500" />;
    case "cycle":
      return <IconActivity className="h-4 w-4 text-green-500" />;
    case "workout":
      return <IconBarbell className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
};

const getScoreStateBadge = (scoreState: string) => {
  const variant =
    scoreState === "SCORED"
      ? "default"
      : scoreState === "PENDING_SCORE"
      ? "secondary"
      : "destructive";

  return (
    <Badge variant={variant as any} className="text-xs">
      {scoreState.replace("_", " ")}
    </Badge>
  );
};

// Define columns for each data type
const recoveryColumns: ColumnDef<WhoopRecoveryRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <span className="capitalize">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "recoveryScore",
    header: "Recovery Score",
    cell: ({ row }) =>
      row.original.recoveryScore
        ? `${Math.round(row.original.recoveryScore)}%`
        : "N/A",
  },
  {
    accessorKey: "restingHeartRate",
    header: "RHR",
    cell: ({ row }) =>
      row.original.restingHeartRate
        ? `${row.original.restingHeartRate} bpm`
        : "N/A",
  },
  {
    accessorKey: "hrvRmssd",
    header: "HRV",
    cell: ({ row }) =>
      row.original.hrvRmssd ? `${Math.round(row.original.hrvRmssd)}ms` : "N/A",
  },
  {
    accessorKey: "scoreState",
    header: "Status",
    cell: ({ row }) => getScoreStateBadge(row.original.scoreState),
  },
];

const sleepColumns: ColumnDef<WhoopSleepRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <span className="capitalize">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "start",
    header: "Sleep Date",
    cell: ({ row }) => formatDate(row.original.start),
  },
  {
    accessorKey: "sleepPerformancePercentage",
    header: "Performance",
    cell: ({ row }) =>
      row.original.sleepPerformancePercentage
        ? `${Math.round(row.original.sleepPerformancePercentage)}%`
        : "N/A",
  },
  {
    accessorKey: "sleepEfficiencyPercentage",
    header: "Efficiency",
    cell: ({ row }) =>
      row.original.sleepEfficiencyPercentage
        ? `${Math.round(row.original.sleepEfficiencyPercentage)}%`
        : "N/A",
  },
  {
    accessorKey: "totalInBedTime",
    header: "In Bed",
    cell: ({ row }) => formatTime(row.original.totalInBedTime),
  },
  {
    accessorKey: "respiratoryRate",
    header: "Resp. Rate",
    cell: ({ row }) =>
      row.original.respiratoryRate
        ? `${row.original.respiratoryRate.toFixed(1)} rpm`
        : "N/A",
  },
  {
    accessorKey: "scoreState",
    header: "Status",
    cell: ({ row }) => getScoreStateBadge(row.original.scoreState),
  },
];

const cycleColumns: ColumnDef<WhoopCycleRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <span className="capitalize">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "start",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.start),
  },
  {
    accessorKey: "strain",
    header: "Strain",
    cell: ({ row }) =>
      row.original.strain ? row.original.strain.toFixed(1) : "N/A",
  },
  {
    accessorKey: "averageHeartRate",
    header: "Avg HR",
    cell: ({ row }) =>
      row.original.averageHeartRate
        ? `${row.original.averageHeartRate} bpm`
        : "N/A",
  },
  {
    accessorKey: "maxHeartRate",
    header: "Max HR",
    cell: ({ row }) =>
      row.original.maxHeartRate ? `${row.original.maxHeartRate} bpm` : "N/A",
  },
  {
    accessorKey: "kilojoule",
    header: "Calories",
    cell: ({ row }) =>
      row.original.kilojoule
        ? `${Math.round(row.original.kilojoule * 0.239)} cal`
        : "N/A",
  },
  {
    accessorKey: "scoreState",
    header: "Status",
    cell: ({ row }) => getScoreStateBadge(row.original.scoreState),
  },
];

const workoutColumns: ColumnDef<WhoopWorkoutRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <span className="capitalize">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "start",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.start),
  },
  {
    accessorKey: "strain",
    header: "Strain",
    cell: ({ row }) =>
      row.original.strain ? row.original.strain.toFixed(1) : "N/A",
  },
  {
    accessorKey: "averageHeartRate",
    header: "Avg HR",
    cell: ({ row }) =>
      row.original.averageHeartRate
        ? `${row.original.averageHeartRate} bpm`
        : "N/A",
  },
  {
    accessorKey: "distanceMeters",
    header: "Distance",
    cell: ({ row }) => {
      if (!row.original.distanceMeters) return "N/A";
      const km = row.original.distanceMeters / 1000;
      return km >= 1
        ? `${km.toFixed(2)} km`
        : `${row.original.distanceMeters.toFixed(0)} m`;
    },
  },
  {
    accessorKey: "kilojoule",
    header: "Calories",
    cell: ({ row }) =>
      row.original.kilojoule
        ? `${Math.round(row.original.kilojoule * 0.239)} cal`
        : "N/A",
  },
  {
    accessorKey: "scoreState",
    header: "Status",
    cell: ({ row }) => getScoreStateBadge(row.original.scoreState),
  },
];

export function WhoopTable({ initialData }: WhoopTableProps) {
  const [whoopData, setWhoopData] = useState<WhoopDataResponse | null>(
    initialData || null
  );
  const [activeTab, setActiveTab] = useState("recovery");

  // Table state
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const isMobile = useIsMobile();

  // Reset table state when switching tabs
  React.useEffect(() => {
    setRowSelection({});
    setPagination({ pageIndex: 0, pageSize: 25 });
    setSorting([]);
    setColumnFilters([]);
  }, [activeTab]);

  const { execute: fetchWhoopData, isPending } = useAction(getWhoopDataAction, {
    onSuccess: (result) => {
      if (result.data) {
        setWhoopData(result.data);
      }
    },
    onError: (error) => {
      console.error("Error fetching WHOOP data:", error);
    },
  });

  const handleRefresh = () => {
    fetchWhoopData({ days: 90, limit: 200 });
  };

  const exportData = async () => {
    try {
      const response = await fetch("/api/wearables/whoop/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `whoop-data-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getCurrentData = (): WhoopRecord[] => {
    if (!whoopData) return [];

    switch (activeTab) {
      case "recovery":
        console.log("Recovery data:", whoopData.recovery?.length);
        return (
          whoopData.recovery?.map((item) => ({
            ...item,
            type: "recovery" as const,
          })) || []
        );
      case "sleep":
        console.log("Sleep data:", whoopData.sleep?.length);
        return (
          whoopData.sleep?.map((item) => ({
            ...item,
            type: "sleep" as const,
          })) || []
        );
      case "cycles":
        console.log("Cycles data:", whoopData.cycles?.length);
        return (
          whoopData.cycles?.map((item) => ({
            ...item,
            type: "cycle" as const,
          })) || []
        );
      case "workouts":
        console.log("Workouts data:", whoopData.workouts?.length);
        return (
          whoopData.workouts?.map((item) => ({
            ...item,
            type: "workout" as const,
          })) || []
        );
      default:
        return [];
    }
  };

  const getCurrentColumns = (): ColumnDef<WhoopRecord>[] => {
    switch (activeTab) {
      case "recovery":
        return recoveryColumns as ColumnDef<WhoopRecord>[];
      case "sleep":
        return sleepColumns as ColumnDef<WhoopRecord>[];
      case "cycles":
        return cycleColumns as ColumnDef<WhoopRecord>[];
      case "workouts":
        return workoutColumns as ColumnDef<WhoopRecord>[];
      default:
        return recoveryColumns as ColumnDef<WhoopRecord>[];
    }
  };

  const table = useReactTable({
    data: getCurrentData(),
    columns: getCurrentColumns(),
    getRowId: (row) => `${activeTab}-${row.id}`,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Show loading only if we don't have initial data and are fetching
  if (isPending && !whoopData) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!whoopData) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="border border-gray-200 bg-gray-50 rounded-lg p-6">
          <h3 className="text-gray-700 font-medium">No WHOOP Data</h3>
          <p className="text-gray-600 mt-2">
            No WHOOP data available. Connect your WHOOP account to see data.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="mt-4"
          >
            <IconRefresh
              className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`}
            />
            {isPending ? "Checking..." : "Check for Data"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">WHOOP Data</h2>
          <p className="text-muted-foreground">
            {whoopData?._metadata?.counts &&
              `${Object.values(whoopData._metadata.counts).reduce(
                (a, b) => a + b,
                0
              )} total records`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
          >
            <IconRefresh
              className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`}
            />
            {isPending ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="recovery" className="flex items-center gap-2">
              <IconHeart className="h-4 w-4" />
              Recovery
              {whoopData?._metadata?.counts.recovery && (
                <Badge variant="secondary" className="ml-1">
                  {whoopData._metadata.counts.recovery}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2">
              <IconMoon className="h-4 w-4" />
              Sleep
              {whoopData?._metadata?.counts.sleep && (
                <Badge variant="secondary" className="ml-1">
                  {whoopData._metadata.counts.sleep}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cycles" className="flex items-center gap-2">
              <IconActivity className="h-4 w-4" />
              Cycles
              {whoopData?._metadata?.counts.cycles && (
                <Badge variant="secondary" className="ml-1">
                  {whoopData._metadata.counts.cycles}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <IconBarbell className="h-4 w-4" />
              Workouts
              {whoopData?._metadata?.counts.workouts && (
                <Badge variant="secondary" className="ml-1">
                  {whoopData._metadata.counts.workouts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns className="h-4 w-4 mr-2" />
                  Columns
                  <IconChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {["recovery", "sleep", "cycles", "workouts"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={getCurrentColumns().length}
                        className="h-24 text-center"
                      >
                        No {activeTab} data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 25, 50, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Cursor rules applied correctly.
