"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PricingModal } from "./PricingModel";
import { BackgroundGradient } from "../Components/BackgroundGradient";
import { PricingTable } from "./PricingTable";

const Page = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Camera Sony A7III",
      originalCost: 2000,
      minuteRate: 5,
      hourRate: 25,
      dayRate: 100,
      weekRate: 500,
      monthRate: 1500,
      yearRate: 15000,
    },
    // Add more products as needed
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      <div className="relative lg:flex space-y-3 block">
        <BackgroundGradient className="absolute right-0 -top-24 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl h-32 w-32 " />
        <BackgroundGradient className="hidden lg:block absolute left-25 top-20 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[400px] w-[450px] text-white" />
        <BackgroundGradient className="absolute left-25 top-0 -z-9 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[200px] w-[150px] text-white" />
      </div>

      <div className="mx-3">
        <div className="">
          <PricingTable data={products} />
        </div>
      </div>
    </div>
  );
};

export default Page;
