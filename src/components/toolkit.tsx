"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TextCleaner } from "@/components/feature/text-cleaner";
import { FileTools } from "@/components/feature/file-tools";
import { MiscTools } from "@/components/feature/misc-tools";
import { Sparkles, FileCog, Wrench } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function Toolkit() {
  return (
    <Tabs defaultValue="text-cleaner" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
        <TabsTrigger value="text-cleaner">
          <Sparkles className="mr-2 h-4 w-4" />
          Limpiador de Texto
        </TabsTrigger>
        <TabsTrigger value="file-tools">
          <FileCog className="mr-2 h-4 w-4" />
          Herramientas de Archivo
        </TabsTrigger>
        <TabsTrigger value="misc-tools">
          <Wrench className="mr-2 h-4 w-4" />
          Utilidades
        </TabsTrigger>
      </TabsList>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <TabsContent value="text-cleaner">
            <TextCleaner />
          </TabsContent>
          <TabsContent value="file-tools">
            <FileTools />
          </TabsContent>
          <TabsContent value="misc-tools">
            <MiscTools />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
