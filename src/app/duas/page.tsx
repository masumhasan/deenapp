
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { Search, Sun, Moon, Utensils, HeartPulse, Car } from "lucide-react";

export default function DuasPage() {
  const { t } = useLanguage();

  const duaCategories = [
    { name: t('morning'), icon: Sun, color: "text-orange-500", key: "morning" },
    { name: t('evening'), icon: Moon, color: "text-indigo-500", key: "evening" },
    { name: t('food_and_drink'), icon: Utensils, color: "text-yellow-600", key: "food_and_drink" },
    { name: t('illness'), icon: HeartPulse, color: "text-red-500", key: "illness" },
    { name: t('travel'), icon: Car, color: "text-blue-500", key: "travel" },
    { name: t('daily'), icon: Sun, color: "text-green-500", key: "daily" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary">
        {t('dua_library')}
      </h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder={t('search_for_a_dua')} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {duaCategories.map((category) => (
          <Card
            key={category.key}
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
                {t('find_supplications_related_to').replace('{category}', category.name.toLowerCase())}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
