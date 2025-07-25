import Markdown from "react-markdown";
import Link from "next/link";
import React from "react";
import { MeetingGetOne } from "../../types";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenTextIcon,
  SparklesIcon,
  FileTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
// import { format } from "date-fns";
import { formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";


interface CompletedStateProps {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: CompletedStateProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-4">
        <Tabs defaultValue="summary">
          <div className="bg-white rounded-lg shadow-md px-3 border">
            <ScrollArea>
              <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                <TabsTrigger
                  value="summary"
                  className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state-active]:border-b-primary data-[state-active]:text-accent-foreground h-full hover:text-accent-foreground"
                >
                  <BookOpenTextIcon />
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="transcript"
                  className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state-active]:border-b-primary data-[state-active]:text-accent-foreground h-full hover:text-accent-foreground"
                >
                  <FileTextIcon />
                  Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="recording"
                  className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state-active]:border-b-primary data-[state-active]:text-accent-foreground h-full hover:text-accent-foreground"
                >
                  <FileVideoIcon />
                  Recording
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state-active]:border-b-primary data-[state-active]:text-accent-foreground h-full hover:text-accent-foreground"
                >
                  <SparklesIcon />
                  Ask AI
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          <TabsContent value="recording">
            <div className="bg-white rounded-lg border px-4 py-5 ">
              <video
                src={data.recordingUrl!}
                className="w-full rounded-lg"
                controls
              ></video>
            </div>
          </TabsContent>
          <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name}/>
          </TabsContent>
          <TabsContent value="transcript">
          <Transcript meetingId={data.id}/>
          </TabsContent>
          <TabsContent value="summary">
            <div className="bg-white rounded-lg border">
              <div className="px-6 py-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold capitalize mb-1">
                  {data.name}
                </h2>
                <div className="flex flex-wrap gap-3 items-center mb-2">
                  <Link
                    href={`/dashboard/tutor/${data.agent.id}`}
                    className="flex items-center gap-x-2 underline underline-offset-2 capitalize font-medium text-base"
                  >
                    <GeneratedAvatar
                      variant="botttsNeutral"
                      seed={data.agent.name}
                      className="size-6"
                    />
                    {data.agent.name}
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {data.startedAt
                      ? format(data.startedAt, "PPP")
                      : "Unknown date"}
                  </Badge>
                  <Badge
                    className="flex items-center gap-x-2 text-xs"
                    variant="outline"
                  >
                    <ClockFadingIcon className="text-blue-700 size-4" />
                    {data.duration
                      ? formatDuration(data.duration)
                      : "Unknown duration"}
                  </Badge>
                </div>
                <div className="flex items-center gap-x-2 mb-2">
                  <SparklesIcon className="size-4 text-yellow-500" />
                  <span className="font-semibold text-base">
                    General Summary
                  </span>
                </div>
                <div className="bg-gray-50 rounded-md p-5 shadow-inner">
                  <Markdown
                    components={{
                      h1: (props) => (
                        <h1 className="text-2xl font-bold mb-4" {...props} />
                      ),
                      h2: (props) => (
                        <h2 className="text-xl font-semibold mb-3" {...props} />
                      ),
                      h3: (props) => (
                        <h3 className="text-lg font-medium mb-2" {...props} />
                      ),
                      h4: (props) => (
                        <h4 className="text-base font-medium mb-2" {...props} />
                      ),
                      p: (props) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      ul: (props) => (
                        <ul className="list-disc list-inside mb-4" {...props} />
                      ),
                      ol: (props) => (
                        <ol
                          className="list-decimal list-inside mb-4"
                          {...props}
                        />
                      ),
                      li: (props) => <li className="mb-1" {...props} />,
                      strong: (props) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      code: (props) => (
                        <code
                          className="bg-gray-100 px-1 py-0.5 rounded text-sm"
                          {...props}
                        />
                      ),
                      blockquote: (props) => (
                        <blockquote
                          className="border-l-4 border-gray-300 pl-4 italic mb-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {data.summary}
                  </Markdown>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
