"use client";

import React, { useState, useEffect } from "react";
import { analyzeToxicity, ToxicityScore } from "@/lib/gemini";
import { ToxicityScale } from "@/components/toxicity-scale";
import AOS from 'aos';

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

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 800,
      easing: 'ease-out-cubic',
    });
  }, []);

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
    if (score >= 9) return "success";
    if (score >= 7) return "secondary";
    if (score >= 5) return "warning";
    if (score >= 3) return "destructive";
    return "destructive";
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-500";
    if (score >= 7) return "text-yellow-500";
    if (score >= 5) return "text-orange-500";
    if (score >= 3) return "text-red-500";
    return "text-red-700";
  };

  const getToxicityDescription = (score: number) => {
    switch (score) {
      case 10: return "Completely non-toxic, respectful, and constructive.";
      case 9: return "Generally respectful with minor criticism.";
      case 8: return "Mildly critical but still respectful and civil.";
      case 7: return "Noticeably critical, some negative tone, but no hostility.";
      case 6: return "Moderately negative, clear criticism, mild hostility.";
      case 5: return "Negative tone with moderate hostility and sarcasm.";
      case 4: return "Clearly hostile, aggressive language, minor insults.";
      case 3: return "Very hostile, significant insults and inflammatory language.";
      case 2: return "Extremely hostile, severe insults, potentially threatening language.";
      case 1: return "Maximum hostility, threats, harassment, or hate speech.";
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

      {/* Remove fade-in from main content area */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="adobe-card p-8 mb-10" data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Topic</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[...controversialTopics, "Other"].map((topic) => (
              <button
                key={topic}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${ 
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

        {/* Results Section - Remove individual fade-in */}
        {result && (
          <div className="adobe-card p-8 mb-10" data-aos="fade-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Communication Analysis</h2>
              <Badge variant={getBadgeColor(result.score)} className="px-4 py-1.5 text-sm font-medium">
                {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
              </Badge>
            </div>
            
            <p className="text-gray-700 mb-6">{getToxicityDescription(result.score)}</p>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-red-600">Toxic</span>
                <span className={`font-semibold ${getScoreColor(result.score)}`}>
                  {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${result.score * 10}%`,
                    background: 'linear-gradient(to right, hsl(0, 90%, 60%), hsl(60, 90%, 60%), hsl(120, 70%, 50%))'
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Score:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}/10
                  </span>
                  <div className="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white rounded-lg border border-gray-300 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <p className="text-sm font-medium mb-1">What does my score mean?</p>
                      <p className="text-xs text-gray-600 mb-2">{getToxicityDescription(result.score)}</p>
                      <p className="text-xs text-blue-600">Scroll down to learn more about the toxicity scale.</p>
                    </div>
                  </div>
                </div>
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
          {/* Remove individual fade-in */}
          <div className="adobe-card p-8" data-aos="fade-up">
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
          
          {/* Remove individual fade-in */}
          <div className="adobe-card p-6" data-aos="fade-up">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Toxicity Scale</h2>
            <ToxicityScale />
          </div>
        </div>

        {/* Before the existing footer, add an inspiration section */}
        <div className="mt-16 mb-12 adobe-card p-8 bg-gradient-to-r from-blue-50 to-purple-50" data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Inspired by "Peacemakers Needed"</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                This tool is inspired by President Russell M. Nelson's April 2023 General Conference talk,
                "Peacemakers Needed," where he teaches that followers of Jesus Christ should be examples
                of compassionate interaction, especially when we have differences of opinion.
              </p>
              <p className="text-gray-700 mb-4">
                "As disciples of Jesus Christ, we are to be examples of how to interact with others—especially
                when we have differences of opinion. One of the easiest ways to identify a true follower of Jesus
                Christ is how compassionately that person treats other people."
              </p>
              <div className="mt-6">
                <a 
                  href="https://www.churchofjesuschrist.org/study/general-conference/2023/04/47nelson?lang=eng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Read the full talk
                </a>
              </div>
            </div>
            <div className="aspect-video">
              <iframe 
                className="w-full h-full rounded-lg shadow-md"
                src="https://www.youtube.com/embed/vQghSMOOYz4?si=EITUlpmmeU-qXT3b" 
                title="Russell M. Nelson: 'Peacemakers Needed'" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
              />
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm border-t border-gray-100 pt-8 pb-12">
          <p className="mb-2">Peacemaker Tool — Promoting constructive political discourse</p>
          <p className="text-xs">Inspired by <a href="https://www.churchofjesuschrist.org/study/general-conference/2023/04/47nelson?lang=eng" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Russell M. Nelson's "Peacemakers Needed" talk</a></p>
        </footer>
      </main>
    </div>
  );
} 