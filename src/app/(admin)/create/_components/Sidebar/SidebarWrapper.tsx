"use client";

import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuLock, LuUnlock } from "react-icons/lu";
import {
  getSidebarLocks,
  getSidebarState,
  setSidebarLocks,
  setSidebarState,
} from "./utils/localStorage";

const LockButton = ({
  isLocked,
  onClick,
}: {
  isLocked: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "group relative z-[120] flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200",
      isLocked
        ? "border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 text-white shadow-lg shadow-black/20"
        : "border-transparent bg-transparent text-zinc-600 hover:border-zinc-700 hover:bg-gradient-to-b hover:from-zinc-800 hover:to-zinc-900 hover:text-white hover:shadow-lg hover:shadow-black/20",
    )}
  >
    <div className="relative flex items-center justify-center">
      {isLocked ? (
        <LuLock
          size={11}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      ) : (
        <LuUnlock
          size={11}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      )}
    </div>
  </button>
);

export const SidebarWrapper = ({
  isOpen,
  children,
  title,
  isLocked,
  onLockToggle,
  position,
  initialWidth = 350,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  title: string;
  isLocked: boolean;
  onLockToggle: () => void;
  position: "left" | "right";
  initialWidth?: number;
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [mounted, setMounted] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    setMounted(true);

    // Only run this effect once on initial mount
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      const state = getSidebarState();
      const locks = getSidebarLocks();

      if (locks[position] && !state[position].isOpen) {
        setSidebarState({
          ...state,
          [position]: {
            ...state[position],
            isOpen: true,
            locked: true,
          },
        });
        onLockToggle();
      }
    }
  }, [position, onLockToggle]);

  const handleResize = useCallback((newWidth: number) => {
    setWidth(Math.max(350, Math.min(600, newWidth)));
  }, []);

  const handleLockToggle = useCallback(() => {
    const locks = getSidebarLocks();
    const state = getSidebarState();

    setSidebarLocks({
      left: locks.left,
      right: locks.right,
      [position]: !isLocked,
    });

    setSidebarState({
      ...state,
      [position]: {
        ...state[position],
        isOpen,
        locked: !isLocked,
      },
    });

    onLockToggle();
  }, [isLocked, onLockToggle, position, isOpen]);

  // Handle main content layout adjustments
  useEffect(() => {
    if (!mounted) return;

    const main = document.querySelector("main");
    if (!main) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      const leftPanel = document.querySelector(
        '[data-position="left"].sidebar-content',
      );
      const rightPanel = document.querySelector(
        '[data-position="right"].sidebar-content',
      );

      if (isMobile) {
        main.style.paddingLeft = "";
        main.style.paddingRight = "";
        main.style.width = "100%";
        main.style.marginLeft = "";
        main.style.marginRight = "";
        return;
      }

      // Reset all styles first
      main.style.transition = "all 0.15s ease-in-out";

      // Get panel states - check both locked AND open state
      const leftPanelLocked = leftPanel?.getAttribute("data-locked") === "true";
      const rightPanelLocked =
        rightPanel?.getAttribute("data-locked") === "true";
      const leftPanelOpen = leftPanel?.getAttribute("data-open") === "true";
      const rightPanelOpen = rightPanel?.getAttribute("data-open") === "true";

      const leftWidth = leftPanel?.getAttribute("data-width") || "0";
      const rightWidth = rightPanel?.getAttribute("data-width") || "0";

      // Only adjust margins if panel is both locked AND open
      const leftPanelActive = leftPanelLocked && leftPanelOpen;
      const rightPanelActive = rightPanelLocked && rightPanelOpen;

      // Reset to layout's default padding
      main.style.paddingLeft = "0px"; // 16 * 4 = 64px (matches layout's px-16)
      main.style.paddingRight = "0px";
      main.style.width = "100%";

      // Calculate margins and width based on active panels
      if (leftPanelActive && rightPanelActive) {
        // main.style.paddingLeft = "0";
        // main.style.paddingRight = "0";
        // main.style.marginLeft = `${Number.parseInt(leftWidth) - 64}px`;
        // main.style.marginRight = `${Number.parseInt(rightWidth) + 64}px`;
        // main.style.width = `calc(100% - ${Number.parseInt(leftWidth) + Number.parseInt(rightWidth) + 128}px)`;
      } else if (leftPanelActive) {
        main.style.paddingLeft = "0";
        main.style.marginLeft = `${Number.parseInt(leftWidth) - 64}px`;
        main.style.marginRight = "0";
        main.style.width = `calc(100% - ${Number.parseInt(leftWidth) + -64}px)`;
      } else if (rightPanelActive) {
        // main.style.paddingRight = "0";
        // main.style.marginRight = `${Number.parseInt(rightWidth) + 64}px`;
        // main.style.marginLeft = "0";
        // main.style.width = `calc(100% - ${Number.parseInt(rightWidth) + 64}px)`;
      } else {
        // If no panels are active, reset margins
        main.style.marginLeft = "0";
        main.style.marginRight = "0";
      }
    };

    // Initial setup
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (main) {
        main.style.transition = "";
        // Reset to layout's default padding
        main.style.paddingLeft = "0px";
        main.style.paddingRight = "px";
        main.style.marginLeft = "0";
        main.style.marginRight = "0";
        main.style.width = "100%";
      }
    };
  }, [isOpen, width, position, isLocked, mounted]);

  // Handle mouse resize functionality
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizing(true);
      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX =
          position === "left" ? e.clientX - startX : startX - e.clientX;
        const newWidth = Math.max(350, Math.min(600, startWidth + deltaX));
        handleResize(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [position, width, handleResize],
  );

  if (!mounted) return null;

  return (
    <motion.div
      initial={false}
      animate={{
        x: isOpen ? 0 : position === "left" ? -width : width,
      }}
      transition={{
        duration: 0.15,
        ease: "easeInOut",
      }}
      className={cn(
        "sidebar-content fixed top-14 z-50 hidden transform lg:flex bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800",
        position === "left" ? "left-0" : "right-0",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      data-position={position}
      data-locked={isLocked}
      data-open={isOpen}
      data-width={width}
      style={{
        width: `${width}px`,
        height: "calc(100vh - 3.5rem)",
        boxShadow:
          !isLocked && isOpen
            ? position === "left"
              ? "4px 0 16px rgba(0,0,0,0.2)"
              : "-4px 0 16px rgba(0,0,0,0.2)"
            : "none",
      }}
    >
      <div
        className={cn(
          "relative flex h-full w-full",
          position === "left" ? "ml-16" : "mr-16",
        )}
      >
        {/* Resize handle */}
        {position === "left" && (
          <div
            className={cn(
              "absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-zinc-600 transition-colors z-[130]",
              isResizing && "bg-zinc-500",
            )}
            onMouseDown={handleMouseDown}
          />
        )}

        <div
          className={cn(
            "relative flex h-full w-full flex-col",
            position === "left"
              ? "border-r border-zinc-800"
              : "border-l border-zinc-800",
          )}
        >
          {/* Header */}
          <div className="relative z-10 flex h-12 items-center justify-between px-3 border-b border-zinc-800">
            {position === "right" && (
              <LockButton isLocked={isLocked} onClick={handleLockToggle} />
            )}
            <div
              className={cn(
                "flex items-center justify-center",
                position === "right" && "flex-1 justify-end",
              )}
            >
              <h2 className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                {title}
              </h2>
            </div>
            {position === "left" && (
              <LockButton isLocked={isLocked} onClick={handleLockToggle} />
            )}
          </div>

          <div className="relative flex-1 overflow-y-auto px-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </div>
        </div>

        {/* Resize handle for right panel */}
        {position === "right" && (
          <div
            className={cn(
              "absolute top-0 left-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-zinc-600 transition-colors z-[130]",
              isResizing && "bg-zinc-500",
            )}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    </motion.div>
  );
};
