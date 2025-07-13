
"use client";

import PrayerTimesClient from "@/components/prayer-times-client";
import { useLanguage } from "@/context/language-context";

export default function PrayerTimesPage() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6">{t('prayer_times')}</h1>
      <PrayerTimesClient />
    </div>
  );
}
