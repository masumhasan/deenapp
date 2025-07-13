
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Star } from "lucide-react";

export default function CalendarPage() {
  const { t } = useLanguage();

  const islamicEvents = [
    { name: t('ramadan_start'), date: "Around March 11, 2024" },
    { name: t('laylat_al_qadr'), date: "Last 10 nights of Ramadan" },
    { name: t('eid_al_fitr'), date: "Around April 10, 2024" },
    { name: t('day_of_arafah'), date: "Around June 15, 2024" },
    { name: t('eid_al_adha'), date: "Around June 16, 2024" },
    { name: t('islamic_new_year'), date: "Around July 7, 2024" },
    { name: t('day_of_ashura'), date: "Around July 16, 2024" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary">
        {t('hijri_calendar')}
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg flex flex-col items-center justify-center p-4">
            <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md"
            />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">
              {t('important_islamic_events')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {islamicEvents.map((event) => (
                <li key={event.name} className="flex items-start gap-4">
                  <Star className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
