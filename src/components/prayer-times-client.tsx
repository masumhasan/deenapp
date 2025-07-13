
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sunrise, Sun, Sunset, Moon, Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const prayerTimesData = [
  { name: "Fajr", time: "04:32", icon: Sunrise },
  { name: "Dhuhr", time: "12:58", icon: Sun },
  { name: "Asr", time: "16:34", icon: Sun },
  { name: "Maghrib", time: "19:47", icon: Sunset },
  { name: "Isha", time: "21:18", icon: Moon },
];

const nextPrayerIndex = 2; // Mock: Asr is the next prayer

export default function PrayerTimesClient() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextPrayerTime = prayerTimesData[nextPrayerIndex].time;
      const [hours, minutes] = nextPrayerTime.split(":").map(Number);
      
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);

      if (now > prayerDate) {
        // If current time is past today's prayer time, calculate for tomorrow
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      const diff = prayerDate.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };

    const timer = setInterval(calculateCountdown, 1000);
    calculateCountdown(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-center text-3xl text-primary">
            Next Prayer: {prayerTimesData[nextPrayerIndex].name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="text-6xl font-bold font-mono text-accent tracking-widest">
            {countdown}
          </div>
          <p className="text-muted-foreground mt-2">until next Salah</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Today's Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {prayerTimesData.map((prayer, index) => (
              <li
                key={prayer.name}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  index === nextPrayerIndex
                    ? "bg-accent/20 border-l-4 border-accent"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-4">
                  <prayer.icon
                    className={`h-6 w-6 ${
                      index === nextPrayerIndex ? "text-accent" : "text-primary"
                    }`}
                  />
                  <span className="font-semibold text-lg">{prayer.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-foreground">
                    {prayer.time}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="madhhab" className="font-semibold">Madhhab</Label>
            <Select defaultValue="shafi">
              <SelectTrigger id="madhhab">
                <SelectValue placeholder="Select Madhhab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shafi">Shafi'i (Standard)</SelectItem>
                <SelectItem value="hanafi">Hanafi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calculation" className="font-semibold">Calculation Method</Label>
            <Select defaultValue="mwl">
              <SelectTrigger id="calculation">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mwl">Muslim World League</SelectItem>
                <SelectItem value="isna">ISNA (North America)</SelectItem>
                <SelectItem value="egyptian">Egyptian General Authority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
