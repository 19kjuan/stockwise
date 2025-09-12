"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogger, LogEntry } from "@/context/logger-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Clipboard, Clock, List, Info, CheckCircle, XCircle, AlertTriangle, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MiscTools() {
  const { logs, addLog } = useLogger();
  const [timestamp, setTimestamp] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  const generateTimestamp = () => {
    const newTimestamp = new Date().toISOString();
    setTimestamp(newTimestamp);
    addLog("Generated new timestamp.");
  };

  const copyTimestamp = () => {
    if (!timestamp) return;
    navigator.clipboard.writeText(timestamp);
    addLog("Timestamp copied to clipboard.", "success");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-500 dark:text-green-400 h-4 w-4 flex-shrink-0" />;
      case 'error': return <XCircle className="text-destructive h-4 w-4 flex-shrink-0" />;
      case 'warning': return <AlertTriangle className="text-yellow-500 dark:text-yellow-400 h-4 w-4 flex-shrink-0" />;
      default: return <Info className="text-muted-foreground h-4 w-4 flex-shrink-0" />;
    }
  }

  return (
    <div className="space-y-8">
      {/* Timestamp Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Clock size={20} /> Timestamp Generator</CardTitle>
          <CardDescription>Generate and copy the current timestamp.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="timestamp-output">Current ISO Timestamp</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input id="timestamp-output" value={timestamp} readOnly placeholder="Generating timestamp..." />
            <Button variant="outline" size="icon" onClick={copyTimestamp} disabled={!timestamp}>
              {copied ? <Check className="h-4 w-4 text-green-500 dark:text-green-400" /> : <Clipboard className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateTimestamp}><Clock className="mr-2 h-4 w-4" /> Generate New</Button>
        </CardFooter>
      </Card>

      {/* Activity Logger */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><List size={20} /> Activity Logger</CardTitle>
          <CardDescription>A log of all actions performed in this session.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/30">
            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    {getLogIcon(log.type)}
                    <div className="flex-1">
                      <p className="font-mono text-xs text-muted-foreground">{log.timestamp}</p>
                      <p>{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No activity yet.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
