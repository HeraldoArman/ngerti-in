import Navbar from "@/modules/landing/ui/navbar";
import Features from "@/modules/landing/views/features";
import Hero from "@/modules/landing/views/hero";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}
