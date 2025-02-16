"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="relative w-10 h-10 overflow-hidden">
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.button
            key="dark"
            onClick={() => setTheme("light")}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Sun className="h-6 w-6 text-yellow-400" />
          </motion.button>
        ) : (
          <motion.button
            key="light"
            onClick={() => setTheme("dark")}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Moon className="h-6 w-6 text-gray-800 dark:text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModeToggle;
