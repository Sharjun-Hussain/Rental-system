import React from "react";
import ModeToggle from "../Components/toggle";
import { HeaderDropDownMenu } from "../Components/HeaderDropDown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <div className="mx-3 my-3">
      <div
        className="text-2xl font-bold lg:h-20 h-14  flex items-center bg-white/30 dark:bg-black/30 
        backdrop-blur-md border border-white/30 dark:border-black/30 shadow-lg p-4 rounded-xl"
      >
        {/* Dashboard Title */}
        <div className="text-black dark:text-white">Dashboard</div>

        {/* Mode Toggle Button */}
        <div className="ms-auto flex">
          <ModeToggle />
          <HeaderDropDownMenu
            Component={
              <div className="mr-2 my-auto hover:cursor-pointer">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="#" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
