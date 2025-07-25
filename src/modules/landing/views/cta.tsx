import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="h-dvh bg-accent w-full flex items-center justify-center">
      <div className="mx-auto max-w-4xl text-center flex flex-col gap-8">
        <div className="px-4 lg:px-0 text-4xl lg:text-6xl font-bold text-center">
          Ready to Transform Your Way of Learning?
        </div>
        <Link href={"/sign-in"}>
          <Button className="cursor-pointer">
            <Star />
            Join us now!
          </Button>
        </Link>
      </div>
    </section>
  );
}
