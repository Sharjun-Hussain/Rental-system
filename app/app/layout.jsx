"use client";
import { LuSun } from "react-icons/lu";
import { Sidebar } from "./layout/sidebar";
import { ModeToggle } from "./Components/toggle";
import Header from "./layout/Header";

const Dashboard = ({ children }) => {
  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]  bg-neutral-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.7),rgba(0,0,0,0))]">
      <div className="flex">
        <div className=" ">
          <Sidebar />
        </div>
        <div className="w-full lg:4/5">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
