"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-8 border"
        />
        <div>
          <div className="font-semibold text-base">{row.original.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {row.original.subject}
            </Badge>
          </div>
        </div>
      </div>
    ),
  },
//   {
//     accessorKey: "meetingCount",
//     header: "Meetings",
//     cell: ({ row }) => (
//       <Badge
//         variant="outline"
//         className="flex items-center gap-x-2 px-2 py-1 text-sm"
//       >
//         <VideoIcon className="text-blue-700 size-4" />
//         {/* <span className="font-medium">{row.original.meetingCount ?? 0}</span> */}
//       </Badge>
//     ),
//   },
];
