"use client";
import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "../Components/BackgroundGradient";
import { CategoryTable } from "./CategoryTable";

const UsersPage = () => {
  const [error, setError] = useState(null);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  // if (!data.length) return <p>Loading...</p>;

  return (
    <div>
      <div className="relative lg:flex space-y-3 block">
        <BackgroundGradient className="absolute right-0 -top-24 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl h-32 w-32 text-white" />
        <BackgroundGradient className="hidden lg:block absolute left-25 top-20 -z-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[400px] w-[450px] text-white" />
        <BackgroundGradient className="absolute left-25 top-0 -z-9 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-[180px] h-[200px] w-[150px] text-white" />
      </div>

      <div className="mx-3">
        <CategoryTable />
      </div>
    </div>
  );
};

export default UsersPage;
