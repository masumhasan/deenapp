
"use client";

import QiblaCompass from "@/components/qibla-compass";
import { useLanguage } from "@/context/language-context";

export default function QiblaPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full items-center justify-center space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">
          {t('qibla_finder')}
        </h1>
        <p className="text-muted-foreground mt-2">
            {t('qibla_finder_description')}
        </p>
      </div>
      <QiblaCompass />
    </div>
  );
}
