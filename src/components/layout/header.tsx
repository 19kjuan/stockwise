import { Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              Kit de Herramientas
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
