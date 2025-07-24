import React from "react";
import { useState } from "react";
import { format, formatDate } from "date-fns";
import { SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generatedAvatarUri } from "@/lib/avatar";
import { trpc } from "@/trpc/server";
import JSONL from "jsonl-parse-stringify"; // or your JSONL parser
// import {format} from "date-fns";

interface TranscriptProps {
  meetingId: string;
}

export const Transcript = ({ meetingId }: TranscriptProps) => {
  const TRPC = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = (data ?? []).filter((item: any) =>
    item.text?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <div className="bg-white rounded-lg border px-4 py-5 flex flex-col  gap-y-4 w-full ">
        <p className="text-sm font-medium">Transcript</p>
        <div className="relative">
          <Input
            className="pl-7 h-9 w-[240px]"
            placeholder="Search transcript"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-y-4">
            {filteredData.map((item: any) => (
              <div key={item.start_ts}>
                <div className="gap-x-2 flex items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        item.user.image ??
                        generatedAvatarUri({
                          seed: item.user.name,
                          variant: "initials",
                        })
                    }
                    alt="User Avatar"
                    />
                  </Avatar>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-sm text-blue-500 font-medium">{format(new Date(0,0,0,0,0,0,item.start_ts),"mm:ss")}</p>
                </div>
                <Highlighter
                className="text-sm text-neutral-700" highlightClassName="bg-yellow" searchWords={[searchQuery]} autoEscape={true} textToHighlight={item.text}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
