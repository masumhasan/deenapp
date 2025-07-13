
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";

interface PrayerTime {
  name: string;
  time: string;
}

interface Location {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

const formatTo12Hour = (time: string, locale: string = 'en-US') => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function NextPrayerCard() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const { t, language } = useLanguage();

  const prayerNameMapping: { [key: string]: string } = useMemo(() => ({
    Fajr: t('fajr'),
    Dhuhr: t('dhuhr'),
    Asr: t('asr'),
    Maghrib: t('maghrib'),
    Isha: t('isha'),
  }), [t]);

  useEffect(() => {
    const fetchPrayerTimesForIP = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch location from IP
            const ipRes = await fetch(`https://ipapi.co/json/`);
            if (!ipRes.ok) {
                throw new Error("Failed to fetch location from IP.");
            }
            const ipData = await ipRes.json();
            const currentLoc = {
              name: `${ipData.city}, ${ipData.country_name}`,
              latitude: ipData.latitude,
              longitude: ipData.longitude,
              timezone: ipData.timezone,
            };
            setLocation(currentLoc);

            // Fetch prayer times
            const date = new Date();
            const prayerRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getTime()/1000}?latitude=${currentLoc.latitude}&longitude=${currentLoc.longitude}&method=2`);
            if (!prayerRes.ok) {
                throw new Error('Failed to fetch prayer times.');
            }
            const prayerData = await prayerRes.json();
            if(prayerData.code !== 200) {
                 throw new Error(prayerData.data || 'Failed to fetch prayer times.');
            }
            const timings = prayerData.data.timings;

            const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const formattedPrayerTimes = prayerOrder.map(name => ({
                name,
                time: timings[name].split(' ')[0],
            }));
            
            setPrayerTimes(formattedPrayerTimes);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            // Fallback to Dhaka if IP lookup fails
            setLocation({ name: "Dhaka, Bangladesh", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchPrayerTimesForIP();
  }, []);
  
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

      let nextPrayerTime: Date;
      let currentNextPrayer;

      if (nextPrayerIdx !== -1) {
        const [hours, minutes] = prayerTimes[nextPrayerIdx].time.split(':').map(Number);
        nextPrayerTime = new Date();
        nextPrayerTime.setHours(hours, minutes, 0, 0);
        currentNextPrayer = prayerTimes[nextPrayerIdx];
      } else {
        // If all prayers for today are done, show Fajr for tomorrow
        nextPrayerIdx = 0;
        const [hours, minutes] = prayerTimes[0].time.split(':').map(Number);
        nextPrayerTime = new Date();
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        nextPrayerTime.setHours(hours, minutes, 0, 0);
        currentNextPrayer = prayerTimes[0];
      }
      setNextPrayer(currentNextPrayer);
      
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
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!nextPrayer) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
          <CardTitle className="font-headline text-center text-3xl text-primary">
          {t('next_prayer').replace('{prayer}', prayerNameMapping[nextPrayer.name]).replace('{time}', formatTo12Hour(nextPrayer.time, language))}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground -mt-2">{location?.name}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
          <div className="text-6xl font-bold font-mono text-accent tracking-widest">
          {countdown}
          </div>
          <p className="text-muted-foreground mt-2">{t('until_next_salah')}</p>
      </CardContent>
    </Card>
  );
}
