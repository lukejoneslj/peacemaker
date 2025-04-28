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
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-full h-8 rounded-full bg-gradient-slider overflow-hidden"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { levels: [1, 2], label: "Non-toxic", description: "Respectful and constructive communication", color: "bg-green-100 text-green-800" },
            { levels: [3, 4], label: "Mild", description: "Critical but still civil discourse", color: "bg-yellow-100 text-yellow-800" },
            { levels: [5, 6], label: "Moderate", description: "Negative tone with some hostility", color: "bg-orange-100 text-orange-800" },
            { levels: [7, 8], label: "Toxic", description: "Clearly hostile and inflammatory", color: "bg-red-100 text-red-800" },
            { levels: [9, 10], label: "Severe", description: "Extreme hostility or hate speech", color: "bg-red-200 text-red-900" },
          ].map((category) => (
            <div key={category.label} className="adobe-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${category.color}`}>
                  {category.label}
                </span>
                <span className="text-sm text-gray-500">Levels {category.levels.join("-")}</span>
              </div>
              <p className="text-sm text-gray-700">{category.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-2">How we measure toxicity:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Level 1-2: Completely respectful and constructive</li>
            <li>Level 3-4: Critical but maintains civility</li>
            <li>Level 5-6: Shows negativity and mild hostility</li>
            <li>Level 7-8: Contains hostile and inflammatory language</li>
            <li>Level 9-10: Contains extreme hostility or hate speech</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 