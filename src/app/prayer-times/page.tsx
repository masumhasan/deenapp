
"use client";

import NextPrayerCard from "@/components/next-prayer-card";
import PrayerTimesClient from "@/components/prayer-times-client";
import { useLanguage } from "@/context/language-context";
import WuduSettingsDialog from "@/components/wudu-settings-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { Label } from "@/components/ui/label";


export default function PrayerTimesPage() {
  const { t } = useLanguage();
  const [isWuduSettingsOpen, setIsWuduSettingsOpen] = useState(false);

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
                <Label htmlFor="wudu-reminder-btn" className="font-semibold text-lg">
                    Wudu Reminder
                </Label>
            </div>
            <Button id="wudu-reminder-btn" variant="outline" onClick={() => setIsWuduSettingsOpen(true)}>
                Settings
            </Button>
        </CardContent>
      </Card>
      
      <NextPrayerCard />
      <PrayerTimesClient />
      <WuduSettingsDialog
        isOpen={isWuduSettingsOpen}
        onClose={() => setIsWuduSettingsOpen(false)}
      />
    </div>
  );
}
