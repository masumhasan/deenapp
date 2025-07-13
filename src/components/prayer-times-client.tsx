
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sunrise, Sun, Sunset, Moon, Bell, Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ElementType;
}

const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
  Sunrise: Sunrise,
};

const formatTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export default function PrayerTimesClient() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async (latitude: number, longitude: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const date = new Date();
        const response = await fetch(`https://api.aladhan.com/v1/timings/${date.getTime()/1000}?latitude=${latitude}&longitude=${longitude}&method=2`);
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times.');
        }
        const data = await response.json();
        const timings = data.data.timings;

        const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const formattedPrayerTimes = prayerOrder.map(name => ({
          name,
          time: timings[name].split(' ')[0], // Remove timezone info
          icon: prayerIcons[name as keyof typeof prayerIcons] || Clock,
        }));
        
        setPrayerTimes(formattedPrayerTimes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Could not get location. Please allow location access and refresh.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date();
      let nextPrayerIdx = -1;

      // Find the next prayer for today
      for (let i = 0; i < prayerTimes.length; i++) {
        const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        if (prayerDate > now) {
          nextPrayerIdx = i;
          break;
        }
      }

      let nextPrayerTime: Date;
      if (nextPrayerIdx !== -1) {
        // Next prayer is today
        const [hours, minutes] = prayerTimes[nextPrayerIdx].time.split(':').map(Number);
        nextPrayerTime = new Date();
        nextPrayerTime.setHours(hours, minutes, 0, 0);
        setNextPrayerIndex(nextPrayerIdx);
      } else {
        // All prayers for today are done, next is Fajr tomorrow
        nextPrayerIdx = 0;
        const [hours, minutes] = prayerTimes[0].time.split(':').map(Number);
        nextPrayerTime = new Date();
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        nextPrayerTime.setHours(hours, minutes, 0, 0);
        setNextPrayerIndex(0);
      }
      
      const diff = nextPrayerTime.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Fetching prayer times for your location...</p>
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const nextPrayer = nextPrayerIndex !== null ? prayerTimes[nextPrayerIndex] : null;

  return (
    <div className="space-y-6">
      {nextPrayer && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-center text-3xl text-primary">
              Next Prayer: {nextPrayer.name} at {formatTo12Hour(nextPrayer.time)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-6xl font-bold font-mono text-accent tracking-widest">
              {countdown}
            </div>
            <p className="text-muted-foreground mt-2">until next Salah</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Today's Prayer Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {prayerTimes.map((prayer, index) => (
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
                    {formatTo12Hour(prayer.time)}
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
