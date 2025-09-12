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
    addLog(`Limpiando texto. Consentimiento de IA: ${useAI}`);

    let cleaned = inputText.trim().replace(/\s+/g, " ");
    
    if (useAI) {
      try {
        const result = await cleanTextWithAI(cleaned);
        if (result.cleanedText) {
            cleaned = result.cleanedText;
            addLog("Limpieza de texto con IA exitosa.", "success");
        } else {
            throw new Error("La limpieza con IA no devolvió texto.");
        }
      } catch (e: any) {
        const errorMessage = e.message || "Ocurrió un error desconocido durante la limpieza con IA.";
        setError(errorMessage);
        addLog(`La limpieza con IA falló: ${errorMessage}`, "error");
        setIsLoading(false);
        setOutputText(cleaned);
        return;
      }
    }
    
    setOutputText(cleaned);
    addLog("Limpieza de texto exitosa.");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="font-headline">Limpiador de Texto Inteligente</CardTitle>
        <CardDescription>
          Limpia y normaliza el texto. Opcionalmente, usa IA para una corrección avanzada.
        </CardDescription>
      </CardHeader>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="input-text">Texto Original</Label>
          <Textarea
            id="input-text"
            placeholder="Pega tu texto aquí..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[250px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="output-text">Texto Limpio</Label>
          <Textarea
            id="output-text"
            placeholder="El texto limpio aparecerá aquí..."
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
            Usar GenAI para limpieza inteligente
          </Label>
        </div>
        <Button onClick={handleCleanText} disabled={isLoading || !inputText}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Limpiando...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Limpiar Texto
            </>
          )}
        </Button>
      </CardFooter>
    </div>
  );
}
