
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sunrise, Sun, Sunset, Moon, Bell, Loader2, AlertCircle, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import NextPrayerCard from "./next-prayer-card";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ElementType;
}

const prayerIcons: { [key: string]: React.ElementType } = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
  Sunrise: Sunrise,
};

const locations = [
    { name: "Dhaka, Bangladesh", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka" },
    { name: "London, UK", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
    { name: "New York, USA", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York" },
    { name: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
    { name: "Mecca, Saudi Arabia", latitude: 21.4225, longitude: 39.8262, timezone: "Asia/Riyadh"},
];

const formatTo12Hour = (time: string, locale: string = 'en-US') => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function PrayerTimesClient() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [timezone, setTimezone] = useState<string>(locations[0].timezone);
  const { t, language } = useLanguage();

  const prayerNameMapping: { [key: string]: string } = useMemo(() => ({
    Fajr: t('fajr'),
    Dhuhr: t('dhuhr'),
    Asr: t('asr'),
    Maghrib: t('maghrib'),
    Isha: t('isha'),
  }), [t]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { latitude, longitude } = selectedLocation;
            const date = new Date();
            const prayerRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getTime()/1000}?latitude=${latitude}&longitude=${longitude}&method=2`);
            if (!prayerRes.ok) {
                throw new Error('Failed to fetch prayer times.');
            }
            const prayerData = await prayerRes.json();
            if(prayerData.code !== 200) {
                 throw new Error(prayerData.data || 'Failed to fetch prayer times.');
            }
            const timings = prayerData.data.timings;
            setTimezone(prayerData.data.meta.timezone);

            const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const formattedPrayerTimes = prayerOrder.map(name => ({
                name,
                time: timings[name].split(' ')[0],
                icon: prayerIcons[name as keyof typeof prayerIcons] || Clock,
            }));
            
            setPrayerTimes(formattedPrayerTimes);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchPrayerTimes();
  }, [selectedLocation]);
  
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date();
      let nextPrayerIdx = -1;

      for (let i = 0; i < prayerTimes.length; i++) {
        const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        if (prayerDate > now) {
          nextPrayerIdx = i;
          break;
        }
      }

      if (nextPrayerIdx === -1) {
          nextPrayerIdx = 0;
      }
      setNextPrayerIndex(nextPrayerIdx);

    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const handleLocationChange = (value: string) => {
    const location = locations.find(l => l.name === value);
    if(location) {
        setSelectedLocation(location);
    }
  }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><MapPin />{t('location')}</CardTitle>
        </CardHeader>
        <CardContent>
           <Select onValueChange={handleLocationChange} defaultValue={selectedLocation.name}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_location')} />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                    <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">{t('fetching_prayer_times_for').replace('{location}', selectedLocation.name)}</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && (
        <>
            <NextPrayerCard />

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="font-headline text-2xl text-primary">
                        {t('todays_prayer_times')}
                    </CardTitle>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">{selectedLocation.name}</p>
                        <p className="text-xs text-muted-foreground">{timezone.replace(/_/g, " ")}</p>
                    </div>
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
                        <span className="font-semibold text-lg">{prayerNameMapping[prayer.name]}</span>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-bold text-foreground">
                            {formatTo12Hour(prayer.time, language)}
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
        </>
      )}
    </div>
  );
}
