import { features } from "@/lib/constants/features";
import FeatureCard from "../ui/feature-card";

export default function Features() {
  return (
    <section id="features" className="bg-muted/30">
      <div>
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
