
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Target } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TasbihClient() {
  const [count, setCount] = useState(0);
  const [dhikr, setDhikr] = useState("SubhanAllah");

  useEffect(() => {
    const savedCount = localStorage.getItem("tasbihCount");
    const savedDhikr = localStorage.getItem("tasbihDhikr");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
    if (savedDhikr) {
      setDhikr(savedDhikr);
    }
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("tasbihCount", newCount.toString());
  };

  const handleReset = () => {
    setCount(0);
    localStorage.setItem("tasbihCount", "0");
  };
  
  const handleDhikrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDhikr(e.target.value);
    localStorage.setItem("tasbihDhikr", e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-0">
          <div
            className="h-64 flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-t-lg cursor-pointer transition-colors hover:bg-primary/90"
            onClick={handleIncrement}
            role="button"
            aria-label="Increment count"
          >
            <p className="text-8xl font-bold font-mono">{count}</p>
            <p className="text-xl font-headline mt-2">{dhikr}</p>
          </div>
          <div className="p-6 space-y-4">
             <Input 
                value={dhikr}
                onChange={handleDhikrChange}
                placeholder="Type your dhikr..."
                className="text-center text-lg font-headline"
            />
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
