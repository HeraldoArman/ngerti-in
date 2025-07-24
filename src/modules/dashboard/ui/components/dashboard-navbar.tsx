"use client";
import { PanelLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import React from "react";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Button
          variant={"ghost"}
          className="bg-black/5 border border-border cursor-text h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          size={"sm"}
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon />
          Search
        </Button>
      </nav>
    </>
  );
};
