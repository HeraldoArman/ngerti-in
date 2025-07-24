import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QuickAccessCard from "../ui/quick-access-card";
import { FileText, Pencil } from "lucide-react";

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
        <div className="grid-cols-1 md:grid-cols-2 gap-6 grid">
          <QuickAccessCard icon={<Pencil />} text="Create a new meeting" />
          <QuickAccessCard
            icon={<FileText />}
            text="See your latest meeting summary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
