import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const islamicEvents = [
  { name: "Ramadan Start", date: "Around March 11, 2024" },
  { name: "Laylat al-Qadr", date: "Last 10 nights of Ramadan" },
  { name: "Eid al-Fitr", date: "Around April 10, 2024" },
  { name: "Day of Arafah", date: "Around June 15, 2024" },
  { name: "Eid al-Adha", date: "Around June 16, 2024" },
  { name: "Islamic New Year", date: "Around July 7, 2024" },
  { name: "Day of Ashura", date: "Around July 16, 2024" },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary">
        Hijri Calendar
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
              Important Islamic Events
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
