"use client";

import { useState } from "react";
import { analyzeDignity, DignityScore } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DignityScale } from "@/components/dignity-scale";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DignityScore | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = await analyzeDignity(inputText);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast.error("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBadgeColor = (score: number) => {
    if (score <= 2) return "destructive";
    if (score <= 4) return "warning";
    if (score <= 6) return "secondary";
    return "success";
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-red-500";
    if (score <= 4) return "text-orange-500";
    if (score <= 6) return "text-blue-500";
    return "text-green-500";
  };

  const getDignityDescription = (score: number) => {
    switch (score) {
      case 1: return "Level one escalates from violent words to violent actions.";
      case 2: return "Level two accuses the other side of promoting evil.";
      case 3: return "Level three attacks the other side's moral character.";
      case 4: return "Level four mocks and attacks the other side's background or beliefs.";
      case 5: return "Level five listens to other views and explains own goals.";
      case 6: return "Level six works with others to find common ground.";
      case 7: return "Level seven fully engages with the other side to discuss disagreements.";
      case 8: return "Seeing oneself in every human being, offering dignity to everyone.";
      default: return "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Dignity Index Evaluator</h1>
          <p className="text-xl text-muted-foreground">
            Analyze your text along the 8-point Dignity Index scale from contempt to dignity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Input Your Text</CardTitle>
                <CardDescription>
                  Paste in social media posts, writings, or any text you'd like to evaluate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter text to analyze..."
                  className="min-h-32"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Text"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {result && (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <Badge variant={result.category === "contempt" ? "destructive" : "success"}>
                      {result.category === "contempt" ? "Contempt" : "Dignity"}
                    </Badge>
                  </div>
                  <CardDescription>{getDignityDescription(result.score)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Contempt</span>
                      <span>Dignity</span>
                    </div>
                    <Progress value={result.score * 12.5} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span>Score:</span>
                      <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}/8
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Explanation:</h3>
                    <p className="text-muted-foreground">{result.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <DignityScale />
            
            <Card>
              <CardHeader>
                <CardTitle>About The Dignity Index</CardTitle>
                <CardDescription>Preventing violence, easing divisions, solving problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  The Dignity Index scores distinct phrases along an eight-point scale from contempt to dignity. Lower scores (1-4) reflect divisive language while higher scores (5-8) reflect language grounded in dignity.
                </p>
                <p>
                  By focusing on the speech and not the speaker, the Dignity Index is designed to draw our attention away from the biases of partisan politics and toward the power we each have to heal our country and each other.
                </p>
                <p className="font-medium">
                  This evaluation uses Google's Gemini AI to analyze text in a similar way to how trained human scorers would evaluate it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 