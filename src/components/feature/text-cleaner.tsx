"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogger } from "@/context/logger-context";
import { cleanTextWithAI } from "@/app/actions";
import { Loader2, Wand2 } from "lucide-react";
import {
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function TextCleaner() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addLog } = useLogger();

  const handleCleanText = async () => {
    setIsLoading(true);
    setError(null);
    addLog(`Cleaning text. AI consent: ${useAI}`);

    let cleaned = inputText.trim().replace(/\s+/g, " ");
    
    if (useAI) {
      try {
        const result = await cleanTextWithAI(cleaned);
        if (result.cleanedText) {
            cleaned = result.cleanedText;
            addLog("AI text cleaning successful.", "success");
        } else {
            throw new Error("AI cleaning returned no text.");
        }
      } catch (e: any) {
        const errorMessage = e.message || "An unknown error occurred during AI cleaning.";
        setError(errorMessage);
        addLog(`AI cleaning failed: ${errorMessage}`, "error");
        setIsLoading(false);
        setOutputText(cleaned);
        return;
      }
    }
    
    setOutputText(cleaned);
    addLog("Text cleaning successful.");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="font-headline">Intelligent Text Cleaner</CardTitle>
        <CardDescription>
          Clean and normalize text. Optionally use AI for advanced correction.
        </CardDescription>
      </CardHeader>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="input-text">Original Text</Label>
          <Textarea
            id="input-text"
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[250px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="output-text">Cleaned Text</Label>
          <Textarea
            id="output-text"
            placeholder="Cleaned text will appear here..."
            value={outputText}
            readOnly
            className="min-h-[250px] bg-muted/50"
          />
        </div>
      </div>
      
      {error && (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-0">
        <div className="flex items-center space-x-2">
          <Checkbox id="use-ai" checked={useAI} onCheckedChange={(checked) => setUseAI(Boolean(checked))} />
          <Label htmlFor="use-ai" className="cursor-pointer">
            Use GenAI for intelligent cleaning
          </Label>
        </div>
        <Button onClick={handleCleanText} disabled={isLoading || !inputText}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cleaning...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Clean Text
            </>
          )}
        </Button>
      </CardFooter>
    </div>
  );
}
