import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="hero"
      className="h-dvh relative flex items-center justify-center px-5"
    >
      <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
        <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl md:text-6xl md:leading-tight font-bold text-foreground max-w-xl w-full md:max-w-xl mx-auto">
          Your Personal AI &nbsp;
          <span className="text-accent-foreground">Study Tutor</span>
        </h1>
        <p className="mt-4 text-foreground max-w-xl mx-auto">
          Learning platform designed to help students learn through interactive
          whiteboard explainations and real-time voice integrations.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:gap-4 w-fit mx-auto">
          <Link href={"/sign-in"}>
            <Button className="h-12 w-48 font-semibold text-xl cursor-pointer">
              Get Started!
            </Button>
          </Link>
        </div>
        <Image
          src={"./laptopmockup.png"}
          width={384}
          height={340}
          quality={100}
          sizes="(max-width: 768px) 100vw, 384px"
          priority={true}
          unoptimized={true}
          alt="app mockup"
          className="relative mt-12 md:mt-16 mx-auto z-5"
        />
      </div>
    </section>
  );
};

export default Hero;
