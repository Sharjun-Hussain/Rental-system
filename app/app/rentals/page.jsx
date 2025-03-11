"use client";
import React, { useState } from "react";
import { Plus, Search, Calendar, Package, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RentalDialog } from "./RentalModel";
import { BackgroundGradient } from "../Components/BackgroundGradient";
import { RentalTable } from "./RentalTable";

const RentalPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample data - replace with your actual data

  const rentalData = [
    {
      id: 1,
      user: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, Anytown, ST 12345",
        outstandingBalance: 150.0,
      },
      products: [
        {
          id: 101,
          productId: 1, // Professional Camera
          quantity: 2,
          duration: 7,
          durationUnit: "days",
        },
        {
          id: 102,
          productId: 2, // Drone
          quantity: 1,
          duration: 7,
          durationUnit: "days",
        },
      ],
      startDate: new Date("2025-02-10"),
      endDate: new Date("2025-02-17"),
      totalAmount: 349.97,
      status: "active",
      returnStatus: "pending",
      paymentStatus: "paid",
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Ave, Somewhere, ST 54321",
        outstandingBalance: 0.0,
      },
      products: [
        {
          id: 201,
          productId: 2, // Drone
          quantity: 1,
          duration: 14,
          durationUnit: "days",
        },
      ],
      startDate: new Date("2025-01-25"),
      endDate: new Date("2025-02-08"),
      totalAmount: 299.98,
      status: "completed",
      returnStatus: "returned",
      paymentStatus: "paid",
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "+1 (555) 444-3333",
        address: "789 Pine St, Othertown, ST 67890",
        outstandingBalance: 249.99,
      },
      products: [
        {
          id: 301,
          productId: 1, // Professional Camera
          quantity: 1,
          duration: 30,
          durationUnit: "days",
        },
      ],
      startDate: new Date("2025-01-15"),
      endDate: new Date("2025-02-14"),
      totalAmount: 599.94,
      status: "overdue",
      returnStatus: "pending",
      paymentStatus: "partial",
    },
    {
      id: 4,
      user: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, Anytown, ST 12345",
        outstandingBalance: 150.0,
      },
      products: [
        {
          id: 401,
          productId: 1, // Professional Camera
          quantity: 1,
          duration: 3,
          durationUnit: "days",
        },
      ],
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-02-04"),
      totalAmount: 99.99,
      status: "completed",
      returnStatus: "returned",
      paymentStatus: "paid",
    },
    {
      id: 5,
      user: {
        id: 4,
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        phone: "+1 (555) 222-1111",
        address: "101 Maple Dr, Newcity, ST 13579",
        outstandingBalance: 75.5,
      },
      products: [
        {
          id: 501,
          productId: 2, // Drone
          quantity: 1,
          duration: 5,
          durationUnit: "days",
        },
        {
          id: 502,
          productId: 1, // Professional Camera
          quantity: 1,
          duration: 5,
          durationUnit: "days",
        },
      ],
      startDate: new Date("2025-02-20"),
      endDate: new Date("2025-02-25"),
      totalAmount: 249.98,
      status: "active",
      returnStatus: "pending",
      paymentStatus: "unpaid",
    },
  ];

  return (
    <div>
      <div className="relative lg:flex space-y-3 block">
        <BackgroundGradient className="absolute right-0 -top-24 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl h-32 w-32 text-white" />
        <BackgroundGradient className="hidden lg:block absolute left-25 top-20 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[400px] w-[450px] text-white" />
        <BackgroundGradient className="absolute left-25 top-0 -z-9 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[200px] w-[150px] text-white" />
      </div>

      <div className="mx-3">
        <div className="">
          <RentalTable data={rentalData} />
        </div>
      </div>
    </div>
  );
};

export default RentalPage;
