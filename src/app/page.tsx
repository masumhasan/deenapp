
"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  HandHeart,
  Landmark,
  Repeat,
  Sparkles,
} from "lucide-react";
import RamadanCard from "@/components/ramadan-card";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t } = useLanguage();

  const featureCards = [
    {
      title: t('prayer_times'),
      description: t('view_daily_prayer_schedules'),
      href: "/prayer-times",
      icon: Landmark,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: t('quran_reader'),
      description: t('explore_the_holy_quran'),
      href: "/quran",
      icon: BookOpen,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: t('dua_library'),
      description: t('find_supplications_for_any_occasion'),
      href: "/duas",
      icon: HandHeart,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: t('tasbih_counter'),
      description: t('track_your_dhikr_and_tasbih'),
      href: "/tasbih",
      icon: Repeat,
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: t('hijri_calendar'),
      description: t('follow_the_islamic_calendar'),
      href: "/calendar",
      icon: Calendar,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: t('ai_assistant'),
      description: t('ask_questions_about_fiqh'),
      href: "/assistant",
      icon: Sparkles,
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center p-8 bg-card rounded-2xl shadow-lg">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight">
          {t('welcome_to_deenstream')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('welcome_subtitle')}
        </p>
      </div>

      <RamadanCard />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out bg-card/80">
              <CardHeader className="flex flex-row items-center gap-4">
                <div
                  className={`p-3 rounded-full ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="font-headline text-xl text-primary group-hover:text-accent">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-md">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
