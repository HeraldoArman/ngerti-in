import Navbar from "@/modules/landing/ui/navbar";
import About from "@/modules/landing/views/about";
import Contact from "@/modules/landing/views/contact";
import Features from "@/modules/landing/views/features";
import Hero from "@/modules/landing/views/hero";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Contact />
    </div>
  );
}
