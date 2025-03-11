/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  Pencil,
  Trash2,
  MoreHorizontal,
  Search,
  Plus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { RentalDialog } from "./RentalModel";
import { format } from "date-fns";
import RentalReturnPage from "./RentalReturnModel";
import RentalReturnModal from "./RentalReturnModel";
import RecordPaymentModal from "./RecordPaymentMode";

export function RentalTable({ data, width, loading, onUpdate, onDelete }) {
  const [sorting, setSorting] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [OpenModal, setOpenModal] = React.useState(false);
  const [OpenRentalReturnModal, setOpenRentalReturnModal] =
    React.useState(false);
  const [openPaymentModal, setOpenPaymentModal] = React.useState(false);
  const [selectedRental, setSelectedRental] = React.useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const columns = [
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
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "products",
      header: "Items",
      cell: ({ row }) => {
        const products = row.original.products;
        return products.reduce((sum, p) => sum + p.quantity, 0);
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        return format(new Date(row.original.startDate), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        return format(new Date(row.original.endDate), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return `$${row.original.totalAmount.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge className={getStatusColor(row.original.status)}>
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        return (
          <Badge className={getPaymentStatusColor(row.original.paymentStatus)}>
            {row.original.paymentStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rental = row.original;
        const [open, setOpen] = React.useState(false);

        const handleDelete = async () => {
          try {
            // Replace with your API endpoint
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_URL}/api/rentals/${rental.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            onDelete && onDelete(rental.id);
            // Optionally, you can call a function to refresh the table data here
          } catch (error) {
            console.error("Failed to delete:", error);
          }
          setOpen(false); // Close dialog after action
        };

        const handleUpdate = (rental) => {
          setSelectedRental(rental);
          setOpenModal(true);
        };

        const handleReturnComplete = (rental) => {
          setOpenRentalReturnModal(true);
          setSelectedRental(rental);
        };

        const handleRecordPayment = (rental) => {
          setSelectedRental(rental);
          setOpenPaymentModal(true);
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => handleUpdate(rental)}>
                  <Pencil size={16} className="me-2" />
                  Edit Rental
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => handleReturnComplete(rental)}>
                  <Pencil size={16} className="me-2" />
                  Mark as Returned
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRecordPayment(rental)}>
                  <Pencil size={16} className="me-2" />
                  Record Payment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 size={16} className="me-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this rental record from the servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className={`${width}`}>
      <div className="joon-card w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between py-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search rentals..."
                value={table.getColumn("user.name")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table
                    .getColumn("user.name")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-8 w-full"
              />
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                setSelectedRental(null);
                setOpenModal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Rental
            </Button>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="border-b-gray-400 dark:border-b-gray-500 border-opacity-100"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center h-12"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-white border-opacity-10"
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
                    colSpan={columns.length}
                    className="h-12 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <span className="text-sm">Rows per page: </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border rounded-md p-1"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option
                  className="bg-secondary"
                  key={pageSize}
                  value={pageSize}
                >
                  {pageSize}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-xs">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <RentalDialog
        isOpen={OpenModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(data) => {
          onUpdate && onUpdate(data);
          setOpenModal(false);
        }}
        rentalData={selectedRental}
      />

      <RentalReturnModal
        rental={selectedRental}
        open={OpenRentalReturnModal}
        onOpenChange={setOpenRentalReturnModal}
      />
      <RecordPaymentModal
        rental={selectedRental}
        open={openPaymentModal}
        onOpenChange={setOpenPaymentModal}
        onUpdate={(updatedRental) => {
          onUpdate && onUpdate(updatedRental);
        }}
      />
    </div>
  );
}
