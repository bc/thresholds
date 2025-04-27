import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CSVRow } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  ColumnDef, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable 
} from "@tanstack/react-table";
import { ArrowUpDown, Search, FilterX } from "lucide-react";

interface ResultsTableProps {
  data: CSVRow[];
}

export function ResultsTable({ data }: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<CSVRow>[] = useMemo(() => [
    {
      accessorKey: "query",
      header: ({ column }) => (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => column.toggleSorting()}>
          <span className="text-[10px] sm:text-xs font-medium">Query</span>
          <ArrowUpDown className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
        </div>
      ),
      cell: ({ row }) => <div className="text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-none">{row.original.query}</div>,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "ground_truth_class",
      header: ({ column }) => (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => column.toggleSorting()}>
          <span className="text-[10px] sm:text-xs font-medium">Truth</span>
          <ArrowUpDown className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
        </div>
      ),
      cell: ({ row }) => <div className="text-[10px] sm:text-xs truncate max-w-[60px] sm:max-w-none">{row.original.ground_truth_class}</div>,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "predicted_class",
      header: ({ column }) => (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => column.toggleSorting()}>
          <span className="text-[10px] sm:text-xs font-medium">Pred.</span>
          <ArrowUpDown className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
        </div>
      ),
      cell: ({ row }) => <div className="text-[10px] sm:text-xs truncate max-w-[60px] sm:max-w-none">{row.original.predicted_class}</div>,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "was_correct",
      header: ({ column }) => (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => column.toggleSorting()}>
          <span className="text-[10px] sm:text-xs font-medium">Correct</span>
          <ArrowUpDown className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.was_correct ? "default" : "destructive"} className={cn(
          "text-[10px] sm:text-xs px-1 py-0 h-4",
          row.original.was_correct ? "bg-green-500 hover:bg-green-500/90" : ""
        )}>
          {row.original.was_correct ? "✓" : "✗"}
        </Badge>
      ),
      enableSorting: true,
      filterFn: (row, id, value) => {
        return value.includes(String(row.getValue(id)));
      },
    },
    {
      accessorKey: "confidence",
      header: ({ column }) => (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => column.toggleSorting()}>
          <span className="text-[10px] sm:text-xs font-medium">Conf.</span>
          <ArrowUpDown className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full min-w-[50px]">
          <Progress 
            value={row.original.confidence * 100} 
            className="h-1 sm:h-1.5 w-full" 
          />
          <span className="text-[10px] sm:text-xs">
            {(row.original.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ),
      enableSorting: true,
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-2 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start sm:items-center">
            <div>
              <h2 className="text-sm sm:text-base font-semibold">Results Table</h2>
              <p className="text-[10px] sm:text-xs text-gray-600">
                Showing predictions filtered by current threshold
              </p>
            </div>
            
            <div className="w-full sm:w-auto sm:max-w-[200px] relative">
              <div className="relative">
                <Search className="absolute left-1.5 top-1.5 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-6 pr-6 text-[10px] h-6 min-h-[24px] sm:text-xs"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    onClick={() => setGlobalFilter("")}
                    className="absolute right-0 top-0 h-6 w-6 p-0"
                  >
                    <FilterX className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Table with auto-scale for mobile */}
        <div className="overflow-auto">
          <div className="w-full inline-block align-middle">
            <div className="overflow-hidden scale-[0.95] transform origin-top-left">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th 
                          key={header.id} 
                          className="py-1 px-1 text-left text-[10px] sm:text-xs font-medium text-gray-700 border-b"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className={row.original.was_correct ? "bg-green-50/70" : "bg-red-50/70"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-1 px-1 border-b border-gray-100">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center text-[10px] sm:text-xs text-gray-500 py-2">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-2 flex justify-between items-center border-t border-gray-200">
          <div className="text-[10px] sm:text-xs text-gray-700">
            Showing all records filtered by threshold
          </div>
          <div className="text-[10px] sm:text-xs text-gray-700">
            Total rows: {table.getFilteredRowModel().rows.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
