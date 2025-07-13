
"use client";

import NextPrayerCard from "@/components/next-prayer-card";
import PrayerTimesClient from "@/components/prayer-times-client";
import { useLanguage } from "@/context/language-context";

export default function PrayerTimesPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2 text-center">
          {t('prayer_times')}
        </h1>
      </div>
      <NextPrayerCard />
      <PrayerTimesClient />
    </div>
  );
}
