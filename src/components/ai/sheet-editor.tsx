"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { parse, unparse } from "papaparse";

interface SpreadsheetEditorProps {
  content: string;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  saveContent: (content: string, debounce: boolean) => void;
  status: "streaming" | "idle";
}

export function SpreadsheetEditor({
  content,
  currentVersionIndex,
  isCurrentVersion,
  saveContent,
  status,
}: SpreadsheetEditorProps) {
  const [data, setData] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Parse CSV content into 2D array
  useEffect(() => {
    if (content) {
      try {
        const parsed = parse<string[]>(content, { skipEmptyLines: false });
        if (parsed.data && parsed.data.length > 0) {
          setData(parsed.data);
        } else {
          // Initialize with empty grid if no data
          setData(
            Array(10)
              .fill(null)
              .map(() => Array(10).fill(""))
          );
        }
      } catch (error) {
        console.error("Error parsing CSV:", error);
        // Initialize with empty grid on error
        setData(
          Array(10)
            .fill(null)
            .map(() => Array(10).fill(""))
        );
      }
    } else {
      // Initialize with empty grid
      setData(
        Array(10)
          .fill(null)
          .map(() => Array(10).fill(""))
      );
    }
  }, [content]);

  // Save data back to CSV format
  const saveData = useCallback(
    (newData: string[][]) => {
      const csvContent = unparse(newData);
      saveContent(csvContent, true);
    },
    [saveContent]
  );

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];

    // Ensure the row exists
    while (newData.length <= row) {
      newData.push(Array(Math.max(10, newData[0]?.length || 10)).fill(""));
    }

    // Ensure the column exists in this row
    while (newData[row].length <= col) {
      newData[row].push("");
    }

    newData[row][col] = value;
    setData(newData);
    saveData(newData);
  };

  const addRow = () => {
    const colCount = Math.max(10, data[0]?.length || 10);
    const newData = [...data, Array(colCount).fill("")];
    setData(newData);
    saveData(newData);
  };

  const addColumn = () => {
    const newData = data.map((row) => [...row, ""]);
    setData(newData);
    saveData(newData);
  };

  const removeRow = () => {
    if (data.length > 1) {
      const newData = data.slice(0, -1);
      setData(newData);
      saveData(newData);
    }
  };

  const removeColumn = () => {
    if (data[0]?.length > 1) {
      const newData = data.map((row) => row.slice(0, -1));
      setData(newData);
      saveData(newData);
    }
  };

  if (status === "streaming") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Generating spreadsheet...</div>
      </div>
    );
  }

  const maxCols = Math.max(10, Math.max(...data.map((row) => row.length)));

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
        <Button onClick={addColumn} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Column
        </Button>
        <Button onClick={removeRow} size="sm" variant="outline">
          <Minus className="h-4 w-4 mr-1" />
          Remove Row
        </Button>
        <Button onClick={removeColumn} size="sm" variant="outline">
          <Minus className="h-4 w-4 mr-1" />
          Remove Column
        </Button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-12 p-2 bg-muted border-r text-xs font-medium text-muted-foreground"></th>
              {Array.from({ length: maxCols }, (_, i) => (
                <th
                  key={i}
                  className="p-2 bg-muted border-r text-xs font-medium text-muted-foreground min-w-24"
                >
                  {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 p-2 bg-muted border-r text-xs font-medium text-muted-foreground text-center">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: maxCols }, (_, colIndex) => (
                  <td key={colIndex} className="p-0 border-r border-b">
                    <Input
                      value={row[colIndex] || ""}
                      onChange={(e) =>
                        updateCell(rowIndex, colIndex, e.target.value)
                      }
                      onFocus={() =>
                        setSelectedCell({ row: rowIndex, col: colIndex })
                      }
                      onBlur={() => setSelectedCell(null)}
                      className={cn(
                        "border-none rounded-none h-10 text-xs",
                        selectedCell?.row === rowIndex &&
                          selectedCell?.col === colIndex &&
                          "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      disabled={!isCurrentVersion}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
