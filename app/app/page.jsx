"use client";
import { CircleArrowDown } from "lucide-react";
import React, { memo, useState } from "react";
import { BackgroundGradient } from "./Components/BackgroundGradient";
import SummaryCard from "./Components/SummaryCard";
import DashboardCharts from "./Components/DashboardCarts";
import DashboardContent from "./Components/DahdboardContent";

// Ensure this is correctly imported

const Page = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div>
      {/* Background gradients */}
      <div className="relative lg:flex space-y-3 block">
        <BackgroundGradient className="absolute right-0 -top-24 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl h-32 w-32 text-white" />
        <BackgroundGradient className="hidden lg:block absolute left-25 top-20 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[400px] w-[450px] text-white" />
        <BackgroundGradient className="absolute left-25 top-0 -z-9 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[200px] w-[150px] text-white" />
      </div>

      {/* Flex container for cards and calendar */}
      <div>
        <div className="mx-3 mr-6">
          <SummaryCard />
          {/* <DashboardCharts /> */}
        </div>
        <div className="mr-6">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default memo(Page);
