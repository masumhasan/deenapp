import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Sun, Moon, Utensils, HeartPulse, Car } from "lucide-react";

const duaCategories = [
  { name: "Morning", icon: Sun, color: "text-orange-500" },
  { name: "Evening", icon: Moon, color: "text-indigo-500" },
  { name: "Food & Drink", icon: Utensils, color: "text-yellow-600" },
  { name: "Illness", icon: HeartPulse, color: "text-red-500" },
  { name: "Travel", icon: Car, color: "text-blue-500" },
  { name: "Daily", icon: Sun, color: "text-green-500" },
];

export default function DuasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary">
        Dua Library
      </h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for a dua..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {duaCategories.map((category) => (
          <Card
            key={category.name}
            className="group hover:bg-accent/10 hover:shadow-lg transition-all cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-xl text-primary group-hover:text-accent">
                <category.icon className={`w-8 h-8 ${category.color}`} />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find supplications related to {category.name.toLowerCase()}.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
