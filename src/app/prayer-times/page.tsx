
"use client";

import { useState, useEffect } from "react";
import NextPrayerCard from "@/components/next-prayer-card";
import PrayerTimesClient from "@/components/prayer-times-client";
import { useLanguage } from "@/context/language-context";
import WuduReminderDialog from "@/components/wudu-reminder-dialog";
import { useLocation } from "@/context/location-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing } from "lucide-react";

interface PrayerTimeSimple {
    name: string;
    time: string;
}

const useWuduReminder = (
  isReminderEnabled: boolean,
  setReminderTriggered: (triggered: boolean) => void
) => {
  const { location } = useLocation();

  useEffect(() => {
    if (!isReminderEnabled || !location) return;

    let isMounted = true;

    const checkPrayerTimes = async () => {
      try {
        const date = new Date();
        const prayerRes = await fetch(
          `https://api.aladhan.com/v1/timings/${Math.floor(
            date.getTime() / 1000
          )}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
        );
        if (!prayerRes.ok) return;

        const prayerData = await prayerRes.json();
        if (prayerData.code !== 200) return;

        const timings = prayerData.data.timings;
        const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const prayerTimes: PrayerTimeSimple[] = prayerOrder.map((name) => ({
          name,
          time: timings[name].split(" ")[0],
        }));

        const now = new Date();
        for (const prayer of prayerTimes) {
          const [hours, minutes] = prayer.time.split(":").map(Number);
          const prayerTime = new Date();
          prayerTime.setHours(hours, minutes, 0, 0);

          if (prayerTime > now) {
            const diffInMinutes = (prayerTime.getTime() - now.getTime()) / (1000 * 60);
            
            if (Math.round(diffInMinutes) === 15) {
               if(isMounted) setReminderTriggered(true);
            }
            break; 
          }
        }
      } catch (error) {
        console.error("Error in Wudu Reminder check:", error);
      }
    };
    
    checkPrayerTimes();
    const interval = setInterval(checkPrayerTimes, 60000); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, [isReminderEnabled, location, setReminderTriggered]);
};


export default function PrayerTimesPage() {
  const { t } = useLanguage();
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [isReminderTriggered, setReminderTriggered] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("wuduReminderEnabled");
    if (savedState) {
      setIsReminderEnabled(JSON.parse(savedState));
    }
  }, []);

  const handleReminderToggle = (enabled: boolean) => {
    setIsReminderEnabled(enabled);
    localStorage.setItem("wuduReminderEnabled", JSON.stringify(enabled));
  };

  useWuduReminder(isReminderEnabled, setReminderTriggered);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2 text-center">
          {t('prayer_times')}
        </h1>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
                <BellRing className="w-6 h-6 text-primary" />
                <Label htmlFor="wudu-reminder" className="font-semibold text-lg">
                    Wudu Reminder
                </Label>
            </div>
            <Switch
                id="wudu-reminder"
                checked={isReminderEnabled}
                onCheckedChange={handleReminderToggle}
            />
        </CardContent>
      </Card>
      
      <NextPrayerCard />
      <PrayerTimesClient />
      <WuduReminderDialog
        isOpen={isReminderTriggered}
        onClose={() => setReminderTriggered(false)}
      />
    </div>
  );
}
