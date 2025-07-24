import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  return <div>page</div>;
};

export default page;
