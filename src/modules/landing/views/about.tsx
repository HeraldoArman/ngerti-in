import { Card, CardContent } from "@/components/ui/card";
import { team } from "@/lib/constants/team";

export default function About() {
  return (
    <section
      id="about"
      className="px-8 lg:px-0 py-24 max-w-4xl mx-auto bg-background flex flex-col"
    >
      <div className="flex flex-col gap-36">
        <div className="flex flex-col gap-8">
          <h1 className="w-full text-center font-bold text-4xl">
            About <span className="text-primary">Ngerti.In</span>
          </h1>
          <p className="text-xl w-full text-center">
            Have you ever struggled to understand teacher&apos;s lecture in
            class? Well, You&apos;re not alone. In today's classroom, many
            students feel lost. Ngerti.In is designed to offers an active and
            personal learning experience, as if they have their own private
            tutor. Whether you're solving equations, brainstorming ideas, or
            stuck on a concept, Ngerti.In is here to help.
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="py-4 flex items-center justify-center flex-col gap-8">
                  <div className="rounded-[50%] size-32 overflow-hidden">
                    <img
                      className="size-full object-cover"
                      src={member.image}
                      alt={member.name}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h4 className="text-xl font-semibold">{member.name}</h4>
                    <p className="text-primary text-sm font-medium">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
