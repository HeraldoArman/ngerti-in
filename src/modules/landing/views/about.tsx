import { Card, CardContent } from "@/components/ui/card";
import { team } from "@/lib/constants/team";

export default function About() {
  return (
    <section
      id="about"
      className="pt-24 pb-8 max-w-4xl mx-auto bg-background flex flex-col"
    >
      <div className="flex flex-col gap-36">
        <div className="flex flex-col gap-8">
          <h1 className="w-full text-center font-bold text-4xl">
            About <span className="text-primary">Ngerti.in</span>
          </h1>
          <p className="text-xl w-full text-center">
            Lorem ipsum dolor sit amet blahblahblah blahblahblahblahfl asd
            saghaskdjghasdkd ghaskjdg asdg kjlashdgkl ashdgjkasdg.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full h-full items-center justify-between">
          <div className="col-span-1 flex flex-col gap-2">
            <h1 className="text-2xl font-bold w-full">Our Story</h1>
            <p>
              Asdfksajdhgkjasdhgjkasdhg asdkjhasdjknghnadsjkghnasjnkdgh akdhfi
              uwahegiueqhgiulqwhegiliuqhwne
              akjsjhgkunweunhguikwheeguiqhwneuigkhqw
              qnwlegunkiwuqegnyqweuigynuiqwgy
            </p>
          </div>
          <img
            className="col-span-1"
            alt="our image"
            src={"/placeholder.avif"}
          />
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
                      src="/placeholder.avif"
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
