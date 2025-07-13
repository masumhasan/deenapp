
"use client";

import TasbihClient from "@/components/tasbih-client";
import { useLanguage } from "@/context/language-context";

export default function TasbihPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 text-center">
        {t('tasbih_counter')}
      </h1>
      <div className="flex-grow">
        <TasbihClient />
      </div>
    </div>
  );
}
