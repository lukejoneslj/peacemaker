"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const toxicityLevels = [
  {
    level: 1,
    title: "Level 1",
    category: "Severe",
    color: "bg-red-700",
    description: "Maximum hostility, threats, harassment, or hate speech.",
  },
  {
    level: 2,
    title: "Level 2",
    category: "Severe",
    color: "bg-red-600",
    description: "Extremely hostile, severe insults, potentially threatening language.",
  },
  {
    level: 3,
    title: "Level 3",
    category: "Toxic",
    color: "bg-red-500",
    description: "Very hostile, significant insults and inflammatory language.",
  },
  {
    level: 4,
    title: "Level 4",
    category: "Toxic",
    color: "bg-orange-500",
    description: "Clearly hostile, aggressive language, minor insults.",
  },
  {
    level: 5,
    title: "Level 5",
    category: "Moderate",
    color: "bg-orange-400",
    description: "Negative tone with moderate hostility and sarcasm.",
  },
  {
    level: 6,
    title: "Level 6",
    category: "Moderate",
    color: "bg-yellow-500",
    description: "Moderately negative, clear criticism, mild hostility.",
  },
  {
    level: 7,
    title: "Level 7",
    category: "Mild",
    color: "bg-yellow-400",
    description: "Noticeably critical, some negative tone, but no hostility.",
  },
  {
    level: 8,
    title: "Level 8",
    category: "Mild",
    color: "bg-green-400",
    description: "Mildly critical but still respectful and civil.",
  },
  {
    level: 9,
    title: "Level 9",
    category: "Non-toxic",
    color: "bg-green-500",
    description: "Generally respectful with minor criticism.",
  },
  {
    level: 10,
    title: "Level 10",
    category: "Non-toxic",
    color: "bg-green-600",
    description: "Completely non-toxic, respectful, and constructive.",
  },
];

export function ToxicityScale() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-full h-8 rounded-full bg-gradient-slider overflow-hidden" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { levels: [1, 2], label: "Severe", description: "Extreme hostility or hate speech", color: "bg-red-200 text-red-900" },
            { levels: [3, 4], label: "Toxic", description: "Clearly hostile and inflammatory", color: "bg-red-100 text-red-800" },
            { levels: [5, 6], label: "Moderate", description: "Negative tone with some hostility", color: "bg-orange-100 text-orange-800" },
            { levels: [7, 8], label: "Mild", description: "Critical but still civil discourse", color: "bg-yellow-100 text-yellow-800" },
            { levels: [9, 10], label: "Non-toxic", description: "Respectful and constructive communication", color: "bg-green-100 text-green-800" },
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
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-800 mb-3 text-lg">Detailed Toxicity Scale:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toxicityLevels.map((level) => (
              <div key={level.level} className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100 shadow-sm">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${level.color}`}>
                  {level.level}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{level.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      level.category === "Non-toxic"
                        ? "bg-green-100 text-green-800"
                        : level.category === "Mild"
                        ? "bg-yellow-100 text-yellow-800"
                        : level.category === "Moderate"
                        ? "bg-orange-100 text-orange-800"
                        : level.category === "Toxic"
                        ? "bg-red-100 text-red-800"
                        : "bg-red-200 text-red-900"
                    }`}>
                      {level.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 