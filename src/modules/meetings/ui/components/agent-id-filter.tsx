import React from "react";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useMeetingsFilters } from "../../hooks/use-meeting-filters";
import { useQuery } from "@tanstack/react-query";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  return (
    <>
      <CommandSelect
        className="h-9"
        placeholder="Filter by agent"
        options={(data?.items ?? []).map((agent) => ({
          id: agent.id,
          value: agent.id,
          children: (
            <div className="flex items-center gap-x-2">
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-4"
              />
              {agent.name}
            </div>
          ),
        }))}
        onSelect={(value) => setFilters({ agentId: value })}
        onSearch={setAgentSearch}
        value={filters.agentId ?? ""}
      />
    </>
  );
};
