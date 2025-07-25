"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Clock } from "lucide-react";

export default function Analytics() {
  const trpc = useTRPC();

  const { data: meetingData } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({}),
  );

  const { data: tutorData } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({}),
  );

  const { data: timeData } = useSuspenseQuery(
    trpc.meetings.getHours.queryOptions(),
  );

  const cards = [
    {
      title: "Total Meetings",
      value: meetingData.total,
      icon: CalendarDays,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "group-hover:text-blue-700",
      hoverBg: "group-hover:bg-blue-100",
    },
    {
      title: "Total Tutors",
      value: tutorData.total,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "group-hover:text-green-700",
      hoverBg: "group-hover:bg-green-100",
    },
    {
      title: "Total Meeting Time",
      value: timeData,
      suffix: "h",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "group-hover:text-purple-700",
      hoverBg: "group-hover:bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={index} 
            className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {card.title}
                  </p>
                  <div className="text-3xl md:text-4xl font-bold text-foreground group-hover:scale-105 transition-transform duration-200">
                    {card.value}
                    {card.suffix && (
                      <span className="font-normal text-xl md:text-2xl text-muted-foreground ml-1">
                        {card.suffix}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${card.bgColor} ${card.hoverBg} ${card.color} ${card.hoverColor} p-3 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              {/* Subtle background decoration */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.bgColor} opacity-20 rounded-full group-hover:opacity-30 group-hover:scale-110 transition-all duration-300`} />
              
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor.replace('bg-', 'from-')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}