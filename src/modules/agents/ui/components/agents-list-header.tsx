"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { NewAgentDialog } from "./new-agent-dialog";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSeacrhFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constant";
import { XCircleIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({ search: "", page: DEFAULT_PAGE });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Tutor  </h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <AgentsSeacrhFilter />
            {isAnyFilterModified && (
              <Button variant={"outline"} size="sm" onClick={onClearFilters}>
                <XCircleIcon className="" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
