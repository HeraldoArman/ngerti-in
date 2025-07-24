"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap , StarIcon, VideoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
const Section = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/dashboard/meetings",
  },
  {
    icon: GraduationCap,
    label: "Tutor",
    href: "/dashboard/tutor",
  }
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href={"/dashboard"} className="flex items-center gap-2 px-2 pt-2">
          <div className="flex gap-4 items-center justify-center">
            <Image src="./logo.svg" height={24} width={24} alt="Ngerti-In" />
            <p className="text-2xl font-semibold">Ngerti-in</p>
          </div>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-40 bg-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Section.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-all duration-200 h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-black/40 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10",
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton></DashboardUserButton>
      </SidebarFooter>
    </Sidebar>
  );
};
