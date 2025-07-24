import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QuickAccessCard from "../ui/quick-access-card";
import { FileText, Pencil, Video } from "lucide-react";

export default function QuickAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Quick Access</CardTitle>
        <CardDescription>
          Quick access for your most common actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid-cols-1 lg:grid-cols-3 gap-6 grid">
          <QuickAccessCard
            icon={<Pencil width={32} />}
            text="Create a new meeting"
          />
          <QuickAccessCard
            icon={<FileText width={32} />}
            text="See latest meeting summary"
          />
          <QuickAccessCard
            icon={<Video width={32} />}
            text="See latest meeting recording"
          />
        </div>
      </CardContent>
    </Card>
  );
}
