"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="w-full bg-white/60 backdrop-blur-2xl border-b border border-border top-0 fixed z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold flex gap-2 items-center">
            <Image alt="logo" width={16} height={16} src="/logo.svg" />
            Ngerti.In
          </Link>

          <button
            className="cursor-pointer flex flex-col justify-center items-center w-8 h-8"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>

        {open && (
          <div className="flex flex-col px-4 pb-4 gap-4 bg-white relative z-10">
            <Link href="#features" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="#about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="#contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link href="/sign-in" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="cursor-pointer w-full">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white/60 backdrop-blur-2xl border-b border-1 border-border top-0 fixed z-10">
      <div className="mx-auto flex max-w-4xl justify-between h-16 items-center">
        <Link href={"/"} className="font-bold">
          <div className="gap-2 flex">
            <Image alt="logo" width={16} height={16} src={"/logo.svg"} />
            Ngerti.In
          </div>
        </Link>
        <div className="flex gap-4 text-md">
          <Link href="#features">Features</Link>
          <Link href="#about">About</Link>
        </div>
        <Link href={"/sign-in"}>
          <Button variant="secondary" className="cursor-pointer">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
