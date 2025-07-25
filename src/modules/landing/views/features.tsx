import { features } from "@/lib/constants/features";
import FeatureCard from "../ui/feature-card";

export default function Features() {
  return (
    <section id="features" className="px-12 lg:px-0 py-16 bg-muted/30">
      <h1 className="text-2xl lg:text-4xl font-bold pt-8 mb-8 w-full text-center">
        Why Choose Us?
      </h1>
      <div>
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
