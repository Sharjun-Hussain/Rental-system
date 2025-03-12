// pages/reports.jsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, SunIcon, MoonIcon } from "lucide-react";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { ReportActions } from "@/components/reports/ReportActions";
import { SortableTableHeader } from "@/components/reports/SortableTableHeader";

import { FilterPanel } from "@/components/reports/FilterPanel";
import { exportToCSV, exportToExcel } from "@/lib/utils/export";

export default function ReportsPage() {
  const { theme, setTheme } = useTheme();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("rental");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rental: {
      status: [],
      customerType: [],
      minimumAmount: "",
      maximumAmount: "",
    },
    inventory: {
      category: [],
      maintenance: "",
      minimumUtilization: "",
      maximumUtilization: "",
    },
    financial: {
      minRevenue: "",
      maxRevenue: "",
    },
  });

  // Sample data - in a real app, you would fetch this from your API
  const rentalReports = [
    {
      id: "RNT-001",
      customer: "Johnson Construction",
      customerType: "Commercial",
      items: ["Concrete Mixer", "Power Drill (2x)"],
      startDate: "2025-02-10",
      endDate: "2025-03-15",
      status: "Active",
      totalAmount: 1250.0,
      deposit: 500.0,
    },
    {
      id: "RNT-002",
      customer: "Smith & Sons",
      customerType: "Commercial",
      items: ["Scaffolding Set", "Pressure Washer"],
      startDate: "2025-01-25",
      endDate: "2025-02-28",
      status: "Completed",
      totalAmount: 875.5,
      deposit: 300.0,
    },
    {
      id: "RNT-003",
      customer: "Oakridge Development",
      customerType: "Commercial",
      items: ["Generator", "Cement Mixer", "Jackhammer"],
      startDate: "2025-02-20",
      endDate: "2025-04-01",
      status: "Active",
      totalAmount: 1875.0,
      deposit: 750.0,
    },
    {
      id: "RNT-004",
      customer: "City Public Works",
      customerType: "Government",
      items: ["Excavator", "Heavy Duty Trailer"],
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      status: "Completed",
      totalAmount: 3200.0,
      deposit: 1000.0,
    },
    {
      id: "RNT-005",
      customer: "Highland Builders",
      customerType: "Commercial",
      items: ["Cordless Drill Set", "Nail Gun", "Circular Saw"],
      startDate: "2025-02-25",
      endDate: "2025-03-25",
      status: "Active",
      totalAmount: 625.5,
      deposit: 200.0,
    },
    {
      id: "RNT-006",
      customer: "Roberts Home Improvement",
      customerType: "Residential",
      items: ["Hammer Drill", "Circular Saw"],
      startDate: "2025-02-15",
      endDate: "2025-02-18",
      status: "Completed",
      totalAmount: 175.0,
      deposit: 50.0,
    },
  ];

  const inventoryReports = [
    {
      id: "INV-001",
      name: "Concrete Mixer",
      category: "Heavy Equipment",
      totalUnits: 8,
      availableUnits: 5,
      maintenanceRequired: 1,
      utilization: "62.5%",
      utilizationValue: 62.5,
    },
    {
      id: "INV-002",
      name: "Power Drill",
      category: "Power Tools",
      totalUnits: 15,
      availableUnits: 9,
      maintenanceRequired: 0,
      utilization: "40.0%",
      utilizationValue: 40.0,
    },
    {
      id: "INV-003",
      name: "Scaffolding Set",
      category: "Structural",
      totalUnits: 6,
      availableUnits: 2,
      maintenanceRequired: 1,
      utilization: "66.7%",
      utilizationValue: 66.7,
    },
    {
      id: "INV-004",
      name: "Generator",
      category: "Power Equipment",
      totalUnits: 10,
      availableUnits: 6,
      maintenanceRequired: 2,
      utilization: "40.0%",
      utilizationValue: 40.0,
    },
    {
      id: "INV-005",
      name: "Jackhammer",
      category: "Heavy Tools",
      totalUnits: 4,
      availableUnits: 2,
      maintenanceRequired: 0,
      utilization: "50.0%",
      utilizationValue: 50.0,
    },
  ];

  const financialReports = [
    {
      month: "January 2025",
      revenue: 12500.0,
      deposits: 5000.0,
      maintenance: 1200.0,
      netProfit: 11300.0,
      topRentedItem: "Excavator",
    },
    {
      month: "February 2025",
      revenue: 14750.0,
      deposits: 5800.0,
      maintenance: 950.0,
      netProfit: 13800.0,
      topRentedItem: "Concrete Mixer",
    },
    {
      month: "March 2025 (Partial)",
      revenue: 8200.0,
      deposits: 3500.0,
      maintenance: 750.0,
      netProfit: 7450.0,
      topRentedItem: "Power Drill",
    },
  ];

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to data
  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      // Handle different data types
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Special handling for utilization which is stored as a string with %
      if (sortConfig.key === "utilization") {
        aValue = a.utilizationValue;
        bValue = b.utilizationValue;
      }

      // Handle numeric values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Handle date strings
      if (sortConfig.key.toLowerCase().includes("date")) {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // Default string comparison
      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  // Apply search and filters to data
  const getFilteredData = (data, type) => {
    // First filter by search query
    let filtered = data.filter((item) => {
      // Check for search query match in any property
      return Object.values(item).some(
        (val) =>
          val && String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // Then apply specific filters
    if (type === "rental") {
      if (filters.rental.status.length > 0) {
        filtered = filtered.filter((item) =>
          filters.rental.status.includes(item.status)
        );
      }

      if (filters.rental.customerType.length > 0) {
        filtered = filtered.filter((item) =>
          filters.rental.customerType.includes(item.customerType)
        );
      }

      if (filters.rental.minimumAmount) {
        filtered = filtered.filter(
          (item) => item.totalAmount >= parseFloat(filters.rental.minimumAmount)
        );
      }

      if (filters.rental.maximumAmount) {
        filtered = filtered.filter(
          (item) => item.totalAmount <= parseFloat(filters.rental.maximumAmount)
        );
      }
    } else if (type === "inventory") {
      if (filters.inventory.category.length > 0) {
        filtered = filtered.filter((item) =>
          filters.inventory.category.includes(item.category)
        );
      }

      if (filters.inventory.maintenance === "required") {
        filtered = filtered.filter((item) => item.maintenanceRequired > 0);
      } else if (filters.inventory.maintenance === "not-required") {
        filtered = filtered.filter((item) => item.maintenanceRequired === 0);
      }

      if (filters.inventory.minimumUtilization) {
        filtered = filtered.filter(
          (item) =>
            item.utilizationValue >=
            parseFloat(filters.inventory.minimumUtilization)
        );
      }

      if (filters.inventory.maximumUtilization) {
        filtered = filtered.filter(
          (item) =>
            item.utilizationValue <=
            parseFloat(filters.inventory.maximumUtilization)
        );
      }
    } else if (type === "financial") {
      if (filters.financial.minRevenue) {
        filtered = filtered.filter(
          (item) => item.revenue >= parseFloat(filters.financial.minRevenue)
        );
      }

      if (filters.financial.maxRevenue) {
        filtered = filtered.filter(
          (item) => item.revenue <= parseFloat(filters.financial.maxRevenue)
        );
      }
    }

    return filtered;
  };

  // Get filtered and sorted data based on report type
  const filteredRentalReports = getSortedData(
    getFilteredData(rentalReports, "rental")
  );
  const filteredInventoryReports = getSortedData(
    getFilteredData(inventoryReports, "inventory")
  );
  const filteredFinancialReports = getSortedData(
    getFilteredData(financialReports, "financial")
  );

  // Handle export
  const handleExport = (format, reportType, dateRange) => {
    let dataToExport;

    switch (reportType) {
      case "rental":
        dataToExport = filteredRentalReports;
        break;
      case "inventory":
        dataToExport = filteredInventoryReports;
        break;
      case "financial":
        dataToExport = filteredFinancialReports;
        break;
      default:
        dataToExport = [];
    }

    if (format === "csv") {
      exportToCSV(dataToExport, reportType, dateRange);
    } else if (format === "excel") {
      exportToExcel(dataToExport, reportType, dateRange);
    }
  };

  // Reset sort when report type changes
  useEffect(() => {
    setSortConfig({ key: "", direction: "asc" });
  }, [reportType]);

  // Calculate totals for summary cards
  const totalActiveRentals = rentalReports.filter(
    (r) => r.status === "Active"
  ).length;
  const totalRevenue = rentalReports.reduce(
    (sum, report) => sum + report.totalAmount,
    0
  );
  const maintenanceRequired = inventoryReports.reduce(
    (sum, item) => sum + item.maintenanceRequired,
    0
  );

  // Calculate inventory utilization percentage
  const inventoryUtilization =
    inventoryReports.length > 0
      ? inventoryReports.reduce((sum, item) => sum + item.utilizationValue, 0) /
        inventoryReports.length
      : 0;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of your rental business
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {/* <DateRangeSelector
              dateRange={dateRange}
              setDateRange={setDateRange}
            /> */}
            {/* <ReportActions
              onExport={handleExport}
              reportType={reportType}
              dateRange={dateRange}
            /> */}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveRentals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalActiveRentals > 3 ? "Busy period" : "Normal activity"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Items Requiring Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRequired}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {maintenanceRequired > 0
                ? "Attention needed"
                : "All equipment operational"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryUtilization.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +4.2% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs, Search & Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <Tabs
          defaultValue="rental"
          value={reportType}
          onValueChange={setReportType}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="rental">Rental Reports</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button> */}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <FilterPanel
          reportType={reportType}
          filters={filters}
          setFilters={setFilters}
          reports={{
            rental: rentalReports,
            inventory: inventoryReports,
            financial: financialReports,
          }}
        />
      )}

      {/* Report Content */}
      <Card className="report-container">
        <CardHeader>
          <CardTitle>
            {reportType === "rental"
              ? "Rental Reports"
              : reportType === "inventory"
              ? "Inventory Reports"
              : "Financial Reports"}
          </CardTitle>
          <CardDescription>
            {reportType === "rental"
              ? "Overview of all equipment rentals and their status"
              : reportType === "inventory"
              ? "Current inventory status and utilization"
              : "Financial performance and revenue breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportType === "rental" && (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHeader
                      column="id"
                      label="ID"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="customer"
                      label="Customer"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="customerType"
                      label="Type"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <TableHead>Items</TableHead>
                    <SortableTableHeader
                      column="startDate"
                      label="Start Date"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="endDate"
                      label="End Date"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="status"
                      label="Status"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="totalAmount"
                      label="Amount"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-right"
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRentalReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No rental reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRentalReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.id}
                        </TableCell>
                        <TableCell>{report.customer}</TableCell>
                        <TableCell>{report.customerType}</TableCell>
                        <TableCell>{report.items.join(", ")}</TableCell>
                        <TableCell>{report.startDate}</TableCell>
                        <TableCell>{report.endDate}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          Rs.{report.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {reportType === "inventory" && (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHeader
                      column="id"
                      label="ID"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="name"
                      label="Item Name"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="category"
                      label="Category"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="totalUnits"
                      label="Total Units"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="availableUnits"
                      label="Available"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="maintenanceRequired"
                      label="Maintenance"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="utilization"
                      label="Utilization"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventoryReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No inventory reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventoryReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.id}
                        </TableCell>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>{report.totalUnits}</TableCell>
                        <TableCell>{report.availableUnits}</TableCell>
                        <TableCell>
                          {report.maintenanceRequired > 0 ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {report.maintenanceRequired} unit
                              {report.maintenanceRequired > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{report.utilization}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {reportType === "financial" && (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHeader
                      column="month"
                      label="Month"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      column="revenue"
                      label="Revenue"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-right"
                    />
                    <SortableTableHeader
                      column="deposits"
                      label="Deposits"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-right"
                    />
                    <SortableTableHeader
                      column="maintenance"
                      label="Maintenance Cost"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-right"
                    />
                    <SortableTableHeader
                      column="netProfit"
                      label="Net Profit"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      className="text-right"
                    />
                    <SortableTableHeader
                      column="topRentedItem"
                      label="Top Rented Item"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFinancialReports.map((report) => (
                    <TableRow key={report.month}>
                      <TableCell className="font-medium">
                        {report.month}
                      </TableCell>
                      <TableCell className="text-right">
                        ${report.revenue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${report.deposits.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${report.maintenance.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${report.netProfit.toFixed(2)}
                      </TableCell>
                      <TableCell>{report.topRentedItem}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {filteredFinancialReports
                        .reduce((sum, item) => sum + item.revenue, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {filteredFinancialReports
                        .reduce((sum, item) => sum + item.deposits, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {filteredFinancialReports
                        .reduce((sum, item) => sum + item.maintenance, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {filteredFinancialReports
                        .reduce((sum, item) => sum + item.netProfit, 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {reportType === "rental"
              ? filteredRentalReports.length
              : reportType === "inventory"
              ? filteredInventoryReports.length
              : filteredFinancialReports.length}{" "}
            records
          </div>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => handleExport("csv", reportType, dateRange)}
          >
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
