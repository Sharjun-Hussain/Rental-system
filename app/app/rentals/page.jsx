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

  const rentals = [
    {
      id: 1,
      customer: "John Doe",
      products: ["Camera Lens", "Tripod"],
      startDate: "2025-02-17",
      endDate: "2025-02-24",
      status: "active",
      total: 249.99,
    },
    {
      id: 2,
      customer: "Jane Smith",
      products: ["Drone"],
      startDate: "2025-02-15",
      endDate: "2025-02-18",
      status: "pending",
      total: 199.99,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="relative lg:flex space-y-3 block">
        <BackgroundGradient className="absolute right-0 -top-24 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl h-32 w-32 text-white" />
        <BackgroundGradient className="hidden lg:block absolute left-25 top-20 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[400px] w-[450px] text-white" />
        <BackgroundGradient className="absolute left-25 top-0 -z-9 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[200px] w-[150px] text-white" />
      </div>

      <div className="mx-3">
        <div className="">
          <RentalTable data={[]} />
        </div>
      </div>
    </div>
  );
};

export default RentalPage;
