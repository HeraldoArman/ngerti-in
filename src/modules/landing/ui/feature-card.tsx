import Image from "next/image";

type Feature = {
  id: number;
  img: string;
  text: string;
  description: string;
  alignment: "left" | "right";
};

interface Props {
  feature: Feature;
}

export default function FeatureCard({ feature }: Props) {
  const isLeft = feature.alignment === "left";

  return (
    <div className="py-16 w-full max-w-4xl mx-auto">
      <div className="container">
        <div
          className={`flex flex-col ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-16`}
        >
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <Image
                src={feature.img || "/placeholder.svg"}
                width={500}
                height={350}
                quality={100}
                alt={feature.text}
                className="rounded-lg shadow-lg"
                unoptimized={true}
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              {feature.text}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
