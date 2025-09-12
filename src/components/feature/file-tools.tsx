"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLogger } from "@/context/logger-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Upload, Download, FileCheck, FileWarning, FileText } from "lucide-react";

export function FileTools() {
  const { addLog } = useLogger();

  // File Reader state
  const [fileContent, setFileContent] = useState("");
  const [readFileName, setReadFileName] = useState("");

  // File Writer state
  const [writerContent, setWriterContent] = useState("");
  const [writerFileName, setWriterFileName] = useState("mi-archivo.txt");

  // Extension Validator state
  const [validatorFile, setValidatorFile] = useState<File | null>(null);
  const [allowedExtensions, setAllowedExtensions] = useState("txt,md,json");
  const [validationResult, setValidationResult] = useState<{ message: string; valid: boolean } | null>(null);
  
  const handleFileRead = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReadFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
        addLog(`Archivo leído: ${file.name}`, "success");
      };
      reader.onerror = () => {
        addLog(`Error al leer el archivo: ${file.name}`, "error");
        setFileContent("Error al leer el archivo.");
      }
      reader.readAsText(file);
    }
  }, [addLog]);

  const handleFileWrite = useCallback(() => {
    if (!writerContent || !writerFileName) {
      addLog("Escritor de archivos: el contenido o el nombre del archivo está vacío.", "warning");
      return;
    }
    const blob = new Blob([writerContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = writerFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(`Archivo descargado: ${writerFileName}`, "success");
  }, [writerContent, writerFileName, addLog]);

  const handleFileValidation = useCallback(() => {
    if (!validatorFile) {
      setValidationResult({ message: "Por favor, selecciona un archivo para validar.", valid: false });
      addLog("Validador: No se seleccionó ningún archivo.", "warning");
      return;
    }
    const fileExtension = validatorFile.name.split('.').pop()?.toLowerCase();
    const extensions = allowedExtensions.split(',').map(ext => ext.trim().toLowerCase());

    if (fileExtension && extensions.includes(fileExtension)) {
      setValidationResult({ message: `La extensión de archivo '.${fileExtension}' está permitida.`, valid: true });
      addLog(`Validación exitosa: ${validatorFile.name}`, "success");
    } else {
      setValidationResult({ message: `La extensión de archivo '.${fileExtension}' no está permitida.`, valid: false });
      addLog(`Validación fallida: ${validatorFile.name}`, "error");
    }
  }, [validatorFile, allowedExtensions, addLog]);

  return (
    <div className="space-y-8">
      {/* File Reader */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><FileText size={20} /> Lector de Archivos</CardTitle>
          <CardDescription>Selecciona un archivo de texto para mostrar su contenido.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-reader-input">Subir Archivo</Label>
            <Input id="file-reader-input" type="file" onChange={handleFileRead} />
          </div>
          {readFileName && (
            <div className="space-y-2">
              <Label>Contenido de {readFileName}:</Label>
              <Textarea value={fileContent} readOnly className="h-48 bg-muted/50" />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* File Writer */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Download size={20} /> Escritor de Archivos</CardTitle>
          <CardDescription>Escribe contenido y descárgalo como un archivo de texto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="writer-content">Contenido del Archivo</Label>
            <Textarea id="writer-content" value={writerContent} onChange={(e) => setWriterContent(e.target.value)} placeholder="Escribe tu contenido aquí..."/>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="writer-filename">Nombre del Archivo</Label>
            <Input id="writer-filename" value={writerFileName} onChange={(e) => setWriterFileName(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFileWrite}><Download className="mr-2 h-4 w-4" /> Guardar en Disco</Button>
        </CardFooter>
      </Card>

      {/* Extension Validator */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><FileCheck size={20} /> Validador de Extensión</CardTitle>
          <CardDescription>Verifica si un archivo tiene una extensión permitida.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="validator-input">Subir Archivo</Label>
            <Input id="validator-input" type="file" onChange={(e) => setValidatorFile(e.target.files?.[0] || null)} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="allowed-extensions">Extensiones Permitidas (separadas por comas)</Label>
            <Input id="allowed-extensions" value={allowedExtensions} onChange={(e) => setAllowedExtensions(e.target.value)} />
          </div>
          {validationResult && (
            <div className={`flex items-center gap-2 text-sm font-medium ${validationResult.valid ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
              {validationResult.valid ? <FileCheck size={16} /> : <FileWarning size={16} />}
              {validationResult.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleFileValidation}><FileCheck className="mr-2 h-4 w-4" /> Validar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
