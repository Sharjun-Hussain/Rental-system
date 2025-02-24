/* eslint-disable react/prop-types */
"use client";
import { useState } from "react";
import { FiChevronsRight } from "react-icons/fi";
import { motion } from "framer-motion";

import {
  CiAlignBottom,
  CiGrid32,
  CiGrid41,
  CiHome,
  CiLocationArrow1,
  CiUser,
  CiViewList,
} from "react-icons/ci";

import { FiDollarSign } from "react-icons/fi";
import Link from "next/link";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 p-2"
      style={{ width: open ? "225px" : "fit-content" }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={CiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigation="/app"
        />
        <Option
          Icon={CiGrid32}
          title="Categories"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
          navigation="/app/categories"
        />
        <Option
          Icon={CiGrid41}
          title="Products"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
          navigation="/app/products"
        />
        <Option
          Icon={FiDollarSign}
          title="Pricing"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
          navigation="/app/pricing"
        />

        <Option
          Icon={CiUser}
          title="Users"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigation="/app/users"
        />
        <Option
          Icon={CiViewList}
          title="Invoices"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
          navigation="/app/invoices"
        />
        <Option
          Icon={CiLocationArrow1}
          title="Rentals"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
          navigation="/app/rentals"
        />
        <Option
          Icon={CiAlignBottom}
          title="Report"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigation="/app/report"
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
  navigation,
}) => {
  return (
    <Link href={navigation}>
      <motion.button
        layout
        onClick={() => setSelected(title)}
        className={`relative flex h-10 w-full items-center  rounded-md transition-colors 
          ${
            selected === title
              ? "bg-blue-200/60 text-blue-900 dark:bg-blue-200/30 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-blue-400/20 dark:hover:bg-blue-200/10"
          }`}
      >
        <motion.div
          layout
          className="grid h-full w-10 place-content-center text-lg"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-semibold"
          >
            {title}
          </motion.span>
        )}
        {notifs && open && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute right-2  size-4 rounded bg-blue-600 dark:bg-blue-400/50 text-xs text-white"
          >
            {notifs}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-gray-300 dark:border-gray-700 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100">
                ABC
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Rental System
              </span>
            </motion.div>
          )}
        </div>
        {/* {open && (
          <FiChevronDown className="mr-2 text-gray-600 dark:text-gray-300" />
        )} */}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-blue-600"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"></path>
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform text-gray-600 dark:text-gray-300 ${
              open && "rotate-180"
            }`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
