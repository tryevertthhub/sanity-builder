"use client";

import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { SidebarWrapper } from "./SidebarWrapper";
import { getSidebarState, setSidebarState } from "./utils/localStorage";

interface SidebarButton {
  id: string;
  icon: IconType;
  panelContent: React.ReactNode;
}

interface SidebarProps {
  position: "left" | "right";
  buttons: SidebarButton[];
  defaultPanel?: string;
}

export const Sidebar = ({ position, buttons, defaultPanel }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activePanel, setActivePanel] = useState<string | undefined>();

  const updateSidebarState = useCallback(
    (isOpen: boolean, panel: string | undefined, locked: boolean) => {
      const state = getSidebarState();
      setSidebarState({
        ...state,
        [position]: {
          isOpen,
          activePanel: panel,
          locked,
        },
      });
    },
    [position],
  );

  const handleLockToggle = useCallback(() => {
    setIsLocked((prevLocked) => {
      const newLockedState = !prevLocked;
      updateSidebarState(isOpen, activePanel, newLockedState);
      return newLockedState;
    });
  }, [isOpen, activePanel, updateSidebarState]);

  const handlePanelToggle = useCallback(
    (panel: string) => {
      if (isMobile) return;

      const newIsOpen = activePanel !== panel || !isOpen;
      const newActivePanel = newIsOpen ? panel : undefined;

      setIsOpen(newIsOpen);
      setActivePanel(newActivePanel);
      updateSidebarState(newIsOpen, newActivePanel, isLocked);
    },
    [isMobile, activePanel, isOpen, isLocked, updateSidebarState],
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isLocked &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        const isClickInAnySidebar = (event.target as Element).closest(
          ".sidebar-content, .fixed-sidebar",
        );
        if (!isClickInAnySidebar) {
          setIsOpen(false);
          setActivePanel(undefined);
          updateSidebarState(false, undefined, false);
        }
      }
    };

    setMounted(true);
    handleResize();

    // Load saved state
    const state = getSidebarState();
    if (state[position].locked && !isMobile) {
      setIsOpen(true);
      setIsLocked(true);
      setActivePanel(state[position].activePanel || defaultPanel);
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocked, position, defaultPanel, updateSidebarState, isMobile]);

  if (!mounted || isMobile) return null;

  const renderPanelContent = () => {
    const activeButton = buttons.find((button) => button.id === activePanel);
    return activeButton?.panelContent || null;
  };

  return (
    <div className="sidebar-content" ref={sidebarRef}>
      <div
        className={cn(
          "fixed top-14 z-[100] flex w-16 flex-col items-center justify-between border-l bg-gradient-to-b from-zinc-900 to-zinc-950 py-4",
          position === "left"
            ? "left-0 border-r border-zinc-800"
            : "right-0 border-l border-zinc-800",
        )}
        style={{ height: "calc(100vh - 3.5rem)" }}
      >
        {/* Top buttons */}
        <div className="relative flex flex-col gap-2">
          {buttons.map((button) => (
            <button
              key={button.id}
              type="button"
              onClick={() => handlePanelToggle(button.id)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200",
                activePanel === button.id && isOpen
                  ? "border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 text-white shadow-lg shadow-black/20"
                  : "border-transparent bg-transparent text-zinc-500 hover:border-zinc-600 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-800 hover:text-white hover:shadow-lg hover:shadow-black/20",
              )}
            >
              <button.icon
                size={16}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>
      <SidebarWrapper
        isOpen={isOpen && !!activePanel}
        title={activePanel || ""}
        isLocked={isLocked}
        onLockToggle={handleLockToggle}
        position={position}
      >
        {renderPanelContent()}
      </SidebarWrapper>
    </div>
  );
};
