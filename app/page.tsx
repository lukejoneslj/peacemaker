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

// Adding a gradient background container component
const GradientBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    {children}
  </div>
);

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
    <div className="bg-white min-h-screen">
      {/* Header section with gradient background */}
      <div className="bg-gradient-vibrant w-full py-24 px-4 relative overflow-hidden">
        {/* Add decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-white opacity-10 blur-xl" />
          <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-white opacity-10 blur-xl" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white opacity-10 blur-lg" />
          
          {/* Add animated particles */}
          <div className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-white opacity-60 animate-pulse" />
          <div className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-white opacity-60 animate-ping" />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-white opacity-60 animate-pulse" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-white/80 text-sm font-medium mb-4 shadow-lg shadow-purple-800/20">
              Communication matters. Words have power.
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-md">
            Peacemaker Tool
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Analyze your political discourse to promote respectful, constructive communication
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center space-x-1">
              {["Analyze", "•", "Improve", "•", "Connect"].map((item, index) => (
                <span key={index} className={`${index % 2 === 0 ? 'text-white font-medium px-2' : 'text-white/60'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="adobe-card p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Topic</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[...controversialTopics, "Other"].map((topic) => (
              <button
                key={topic}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedTopic === topic
                    ? "bg-gradient-purple-blue text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleTopicSelect(topic)}
                type="button"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />
            </div>
          )}
          
          {/* Text Input Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-800">Share Your Perspective</h3>
              {selectedTopic && (
                <div className="text-sm text-purple-600 font-medium">
                  Topic: {selectedTopic === "Other" ? customTopic : selectedTopic}
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-4">
              Give your raw, unfiltered thoughts about this issue. What do you think should be done? Why do you hold this position?
            </p>
            <div className="adobe-card-dashed p-4">
              <Textarea
                placeholder={selectedTopic === "Other" && customTopic 
                  ? `What are your thoughts on ${customTopic.toLowerCase()}?` 
                  : selectedTopic 
                    ? `What are your thoughts on ${selectedTopic.toLowerCase()}?` 
                    : "Select a topic above, then share your perspective..."}
                className="min-h-[150px] focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none border-0 shadow-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!selectedTopic || (selectedTopic === "Other" && !customTopic.trim())}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !selectedTopic || !inputText.trim() || (selectedTopic === "Other" && !customTopic.trim())}
                className="bg-gradient-purple-blue hover:opacity-90 transition-opacity"
                type="button"
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
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="adobe-card p-8 mb-10 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Communication Analysis</h2>
              <Badge variant={getBadgeColor(result.score)} className="px-4 py-1.5 text-sm font-medium">
                {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
              </Badge>
            </div>
            
            <p className="text-gray-700 mb-6">{getToxicityDescription(result.score)}</p>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-green-600">Non-toxic</span>
                <span className="text-red-600">Severe</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-slider" 
                  style={{ width: `${result.score * 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Score:</span>
                <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/10
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Analysis</h3>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p>{result.explanation}</p>
              </div>
            </div>

            {result.improvementTips && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">How to Improve</h3>
                <ul className="space-y-4">
                  {result.improvementTips.map((tip, index) => (
                    <li key={`tip-${index}`} className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-indigo-900">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* About & Toxicity Scale Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="adobe-card p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">About the Peacemaker Tool</h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                The Peacemaker Tool helps you reflect on how you communicate about controversial political topics. By analyzing your language along a toxicity scale, it provides guidance on how to express your views more respectfully and constructively.
              </p>
              <div className="space-y-3 bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800">Why This Matters:</h3>
                <p className="text-indigo-700">
                  In today's polarized climate, how we discuss controversial issues can either bridge divides or deepen them. Learning to express our authentic views with respect and understanding is essential for healthy democratic discourse.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">How to Use:</h3>
                <ol className="list-decimal pl-8 space-y-2 text-gray-700">
                  <li>Select a controversial topic that matters to you</li>
                  <li>Share your genuine perspective on the issue</li>
                  <li>Receive an analysis of your communication style</li>
                  <li>Review personalized tips to improve your messaging</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="adobe-card p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Toxicity Scale</h2>
            <ToxicityScale />
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm border-t border-gray-100 pt-8 pb-12">
          <p>Peacemaker Tool — Promoting constructive political discourse</p>
        </footer>
      </main>
    </div>
  );
} 