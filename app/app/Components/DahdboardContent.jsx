import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  Filter,
  RefreshCcw,
} from "lucide-react";

const DashboardContent = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 1, 1),
    to: new Date(),
  });

  // Sample data - replace with your actual data
  const monthlyData = [
    { name: "Jan", revenue: 4000, rentals: 240, returns: 230 },
    { name: "Feb", revenue: 3000, rentals: 210, returns: 200 },
    { name: "Mar", revenue: 5000, rentals: 280, returns: 270 },
    { name: "Apr", revenue: 4500, rentals: 250, returns: 240 },
    { name: "May", revenue: 6000, rentals: 300, returns: 290 },
    { name: "Jun", revenue: 5500, rentals: 290, returns: 280 },
  ];

  const tableData = [
    {
      id: "1",
      item: "Power Drill XL2000",
      status: "Rented",
      customer: "John Doe",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      revenue: "$125.00",
    },
    {
      id: "2",
      item: "Concrete Mixer",
      status: "Available",
      customer: "-",
      startDate: "-",
      endDate: "-",
      revenue: "$0.00",
    },
    {
      id: "3",
      item: "Chainsaw Pro",
      status: "Maintenance",
      customer: "-",
      startDate: "-",
      endDate: "-",
      revenue: "$0.00",
    },
    {
      id: "4",
      item: "Generator 5000W",
      status: "Rented",
      customer: "Alice Smith",
      startDate: "2024-02-18",
      endDate: "2024-02-25",
      revenue: "$320.00",
    },
    {
      id: "5",
      item: "Ladder 20ft",
      status: "Rented",
      customer: "Bob Johnson",
      startDate: "2024-02-17",
      endDate: "2024-02-19",
      revenue: "$45.00",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Rented: "bg-blue-100 text-blue-800",
      Available: "bg-green-100 text-green-800",
      Maintenance: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 joon-card">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-none">
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                {format(dateRange.to, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}

        <div className=" p-3 joon-card ">
          <div className="flex flex-1 justify-between">
            <div className="text-md">Revenue Trend</div>
            <div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-[130px] m-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            {" "}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className=" p-3 joon-card ">
          <div className="flex flex-1 justify-between">
            <div className="text-md"> Rentals vs Returns</div>
            <div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-[130px] m-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            {" "}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rentals"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: "#dc2626" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Rentals vs Returns */}
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Rentals</CardTitle>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.item}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.startDate}</TableCell>
                    <TableCell>{row.endDate}</TableCell>
                    <TableCell className="text-right">{row.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
