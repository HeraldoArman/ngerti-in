import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Meetings
            <div className="text-4xl font-bold">12</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Tutors
            <div className="text-4xl font-bold">8</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            Total Meeting Time
            <div>
              <div className="text-4xl font-bold">
                6.4 <span className="font-normal text-2xl">h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
