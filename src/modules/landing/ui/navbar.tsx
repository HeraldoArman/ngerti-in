import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="w-full bg-white border-b border-1 border-border top-0 fixed z-10">
      <div className="mx-auto flex max-w-4xl justify-between h-12 items-center">
        <Link href={"/"} className="font-bold">
          <div className="gap-2 flex">
            <Image alt="logo" width={16} height={16} src={"/logo.svg"} />
            Ngerti.in
          </div>
        </Link>
        <div className="flex gap-4 text-md">
          <Link href="#features">Features</Link>
          <Link href="#contact">Contact</Link>
          <Link href="#about">About</Link>
        </div>
        <Button variant="secondary" className="cursor-pointer">
          Sign In
        </Button>
      </div>
    </div>
  );
}
