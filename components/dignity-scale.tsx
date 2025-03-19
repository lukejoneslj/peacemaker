"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const dignityLevels = [
  {
    level: 1,
    title: "Level 1",
    category: "Contempt",
    color: "bg-red-600",
    description: "Escalates from violent words to violent actions. Views others as less than human and calls for violence.",
    subtext: "They're not even human. It's our moral duty to destroy them before they destroy us.",
  },
  {
    level: 2,
    title: "Level 2",
    category: "Contempt",
    color: "bg-red-500",
    description: "Accuses the other side of promoting evil, not just doing bad.",
    subtext: "Those people are evil and they're going to ruin everything if we let them. It's us or them.",
  },
  {
    level: 3,
    title: "Level 3",
    category: "Contempt",
    color: "bg-orange-500",
    description: "Attacks the other side's moral character, not just capabilities.",
    subtext: "We're the good people and they're the bad people. It's us vs. them.",
  },
  {
    level: 4,
    title: "Level 4",
    category: "Contempt",
    color: "bg-amber-500",
    description: "Mocks and attacks the other side's background, beliefs, commitment, or competence.",
    subtext: "We're better than those people. They don't really belong. They're not one of us.",
  },
  {
    level: 5,
    title: "Level 5",
    category: "Dignity",
    color: "bg-blue-500",
    description: "Listens to other views and respectfully explains own goals and plans.",
    subtext: "The other side has a right to be here and a right to be heard. They belong here too.",
  },
  {
    level: 6,
    title: "Level 6",
    category: "Dignity",
    color: "bg-blue-600",
    description: "Sees working with others to find common ground as a welcome duty.",
    subtext: "We always talk to the other side, searching for the values and interests we share.",
  },
  {
    level: 7,
    title: "Level 7",
    category: "Dignity",
    color: "bg-green-500",
    description: "Wants to fully engage the other side to discuss deep disagreements.",
    subtext: "We fully engage with the other side, discussing even values and interests we don't share, open to admitting mistakes or changing our minds.",
  },
  {
    level: 8,
    title: "Level 8",
    category: "Dignity",
    color: "bg-green-600",
    description: "Sees oneself in every human being and offers dignity to everyone.",
    subtext: "Each one of us is born with inherent worth, so we treat everyone with dignity--no matter what.",
  },
];

export function DignityScale() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>The Dignity Index Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-8 gap-1">
            {dignityLevels.map((level) => (
              <HoverCard key={level.level} openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div
                    className={`h-6 rounded cursor-pointer transition-all ${level.color} ${
                      level.level <= 4 ? "hover:bg-opacity-90" : "hover:bg-opacity-90"
                    }`}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{level.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          level.category === "Contempt"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {level.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                    <div className="text-xs italic border-l-2 pl-2 border-muted">
                      The Subtext: "{level.subtext}"
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-0.5 mt-1">
            <span>Contempt</span>
            <span>Dignity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 