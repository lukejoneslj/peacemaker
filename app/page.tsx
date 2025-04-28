"use client";

import React, { useState } from "react";
import { analyzeToxicity, ToxicityScore } from "@/lib/gemini";
import { ToxicityScale } from "@/components/toxicity-scale";

// Simple UI component replacements
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button = ({ children, onClick, disabled, className = "", type = "button" }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

interface TextareaProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const Textarea = ({ placeholder, className = "", value, onChange, disabled }: TextareaProps) => (
  <textarea
    placeholder={placeholder}
    className={`w-full border border-gray-300 rounded-md p-2 ${className}`}
    value={value}
    onChange={onChange}
    disabled={disabled}
  />
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: CardProps) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: CardProps) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }: CardProps) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
const CardContent = ({ children, className = "" }: CardProps) => <div className={`p-4 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = "" }: CardProps) => <div className={`p-4 border-t ${className}`}>{children}</div>;

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress = ({ value, className = "" }: ProgressProps) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-blue-600 h-full rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "secondary";
  className?: string;
}

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    secondary: "bg-purple-100 text-purple-800",
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface LoaderProps {
  className?: string;
}

const Loader2 = ({ className = "" }: LoaderProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const toast = {
  error: (message: string) => {
    console.error(message);
    alert(message);
  }
};

// List of controversial political topics
const controversialTopics = [
  "Abortion Rights",
  "Gun Control",
  "Immigration Reform",
  "Climate Change Policy",
  "Healthcare Reform",
  "Tax Policy",
  "Election Integrity",
  "LGBTQ+ Rights",
  "Police Reform",
  "Welfare Programs",
  "Income Inequality",
  "Education Policy",
  "Foreign Policy",
  "Vaccine Mandates",
  "Marijuana Legalization",
  "Religious Freedom",
  "Racial Equity",
  "Free Speech",
  "Supreme Court Reform",
  "Military Spending"
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ToxicityScore | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    if (topic === "Other") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomTopic("");
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    // Use custom topic if "Other" is selected
    const topicToAnalyze = selectedTopic === "Other" ? customTopic : selectedTopic;

    if (selectedTopic === "Other" && !customTopic.trim()) {
      toast.error("Please enter a custom topic");
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = await analyzeToxicity(inputText, topicToAnalyze);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast.error("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBadgeColor = (score: number) => {
    if (score <= 2) return "success";
    if (score <= 4) return "secondary";
    if (score <= 6) return "warning";
    if (score <= 8) return "destructive";
    return "destructive";
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-green-500";
    if (score <= 4) return "text-yellow-500";
    if (score <= 6) return "text-orange-500";
    if (score <= 8) return "text-red-500";
    return "text-red-700";
  };

  const getToxicityDescription = (score: number) => {
    switch (score) {
      case 1: return "Completely non-toxic, respectful, and constructive.";
      case 2: return "Generally respectful with minor criticism.";
      case 3: return "Mildly critical but still respectful and civil.";
      case 4: return "Noticeably critical, some negative tone, but no hostility.";
      case 5: return "Moderately negative, clear criticism, mild hostility.";
      case 6: return "Negative tone with moderate hostility and sarcasm.";
      case 7: return "Clearly hostile, aggressive language, minor insults.";
      case 8: return "Very hostile, significant insults and inflammatory language.";
      case 9: return "Extremely hostile, severe insults, potentially threatening language.";
      case 10: return "Maximum hostility, threats, harassment, or hate speech.";
      default: return "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Peacemaker Tool</h1>
          <p className="text-xl text-muted-foreground">
            Analyze your political discourse to promote respectful, constructive communication
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-3">Choose a Topic</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[...controversialTopics, "Other"].map((topic) => (
                <button
                  key={topic}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedTopic === topic
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTopicSelect(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
            
            {showCustomInput && (
              <div className="mt-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter your custom topic..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Share Your Perspective</CardTitle>
                <CardDescription>
                  Give your raw, unfiltered thoughts about this issue. What do you think should be done? Why do you hold this position?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={selectedTopic === "Other" && customTopic 
                    ? `What are your thoughts on ${customTopic.toLowerCase()}?` 
                    : selectedTopic 
                      ? `What are your thoughts on ${selectedTopic.toLowerCase()}?` 
                      : "Select a topic above, then share your perspective..."}
                  className="min-h-32"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={!selectedTopic || (selectedTopic === "Other" && !customTopic.trim())}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedTopic || (selectedTopic === "Other" && !customTopic.trim())}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Perspective"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {result && (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Communication Analysis</CardTitle>
                    <Badge variant={getBadgeColor(result.score)}>
                      {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{getToxicityDescription(result.score)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Non-toxic</span>
                      <span>Severe</span>
                    </div>
                    <Progress value={result.score * 10} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span>Score:</span>
                      <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}/10
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Analysis & Peacemaker Guidance:</h3>
                    <div className="text-muted-foreground space-y-2">
                      <p>{result.explanation}</p>
                      {result.improvementTips && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Tips to improve communication:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {result.improvementTips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <ToxicityScale />
            
            <Card>
              <CardHeader>
                <CardTitle>About the Peacemaker Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Peacemaker Tool helps you reflect on how you communicate about controversial political topics. By analyzing your language along a toxicity scale, it provides guidance on how to express your views more respectfully and constructively.
                </p>
                <div className="space-y-2">
                  <h3 className="font-medium">Why This Matters:</h3>
                  <p>
                    In today's polarized climate, how we discuss controversial issues can either bridge divides or deepen them. Learning to express our authentic views with respect and understanding is essential for healthy democratic discourse.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">How to Use:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Select a controversial topic that matters to you</li>
                    <li>Share your genuine perspective on the issue</li>
                    <li>Receive an analysis of your communication style</li>
                    <li>Review personalized tips to improve your messaging</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 