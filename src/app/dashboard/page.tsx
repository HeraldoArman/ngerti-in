import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";
import QuickAccess from "@/modules/main-dashboard/views/quick-access";
import Analytics from "@/modules/main-dashboard/views/analytics";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8 flex-col flex gap-8">
      <Analytics />
      <QuickAccess />
    </div>
  );
};

export default page;
