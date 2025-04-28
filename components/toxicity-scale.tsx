"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const toxicityLevels = [
  {
    level: 1,
    title: "Level 1",
    category: "Non-toxic",
    color: "bg-green-600",
    description: "Completely non-toxic, respectful, and constructive.",
    subtext: "This communication is completely respectful and contributes positively to the conversation.",
  },
  {
    level: 2,
    title: "Level 2",
    category: "Non-toxic",
    color: "bg-green-500",
    description: "Generally respectful with minor criticism.",
    subtext: "The message maintains respect while offering some light critique or feedback.",
  },
  {
    level: 3,
    title: "Level 3",
    category: "Mild",
    color: "bg-green-400",
    description: "Mildly critical but still respectful and civil.",
    subtext: "Although critical, the communication remains civil and focused on ideas rather than people.",
  },
  {
    level: 4,
    title: "Level 4",
    category: "Mild",
    color: "bg-yellow-400",
    description: "Noticeably critical, some negative tone, but no hostility.",
    subtext: "The tone is noticeably negative, but there's no direct hostility or personal attacks.",
  },
  {
    level: 5,
    title: "Level 5",
    category: "Moderate",
    color: "bg-yellow-500",
    description: "Moderately negative, clear criticism, mild hostility.",
    subtext: "Shows clear negativity with some hostility, but remains within conversational bounds.",
  },
  {
    level: 6,
    title: "Level 6",
    category: "Moderate",
    color: "bg-orange-400",
    description: "Negative tone with moderate hostility and sarcasm.",
    subtext: "Contains evident hostility and sarcasm that could disrupt productive conversation.",
  },
  {
    level: 7,
    title: "Level 7",
    category: "Toxic",
    color: "bg-orange-500",
    description: "Clearly hostile, aggressive language, minor insults.",
    subtext: "Contains aggressive language and insults that would likely shut down constructive dialogue.",
  },
  {
    level: 8,
    title: "Level 8",
    category: "Toxic",
    color: "bg-red-500",
    description: "Very hostile, significant insults and inflammatory language.",
    subtext: "Features significant insults and inflammatory language that would damage relationships.",
  },
  {
    level: 9,
    title: "Level 9",
    category: "Severe",
    color: "bg-red-600",
    description: "Extremely hostile, severe insults, potentially threatening language.",
    subtext: "Contains severe insults and implied threats that could cause serious harm to others.",
  },
  {
    level: 10,
    title: "Level 10",
    category: "Severe",
    color: "bg-red-700",
    description: "Maximum hostility, threats, harassment, or hate speech.",
    subtext: "Contains explicit threats, harassment, or hate speech that could lead to harm.",
  },
];

export function ToxicityScale() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Toxicity Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-10 gap-1">
            {toxicityLevels.map((level) => (
              <HoverCard key={level.level} openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div
                    className={`h-6 rounded cursor-pointer transition-all ${level.color} hover:bg-opacity-90`}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{level.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          level.category === "Non-toxic"
                            ? "bg-green-100 text-green-800"
                            : level.category === "Mild"
                            ? "bg-yellow-100 text-yellow-800"
                            : level.category === "Moderate"
                            ? "bg-orange-100 text-orange-800"
                            : level.category === "Toxic"
                            ? "bg-red-100 text-red-800"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {level.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                    <div className="text-xs italic border-l-2 pl-2 border-muted">
                      Example: "{level.subtext}"
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-0.5 mt-1">
            <span>Non-toxic</span>
            <span>Severe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 