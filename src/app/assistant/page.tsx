
"use client";

import AssistantClient from "@/components/assistant-client";
import { useLanguage } from "@/context/language-context";

export default function AssistantPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">
          {t('ai_assistant')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('get_answers_fiqh')}
        </p>
      </div>
      <AssistantClient />
    </div>
  );
}
