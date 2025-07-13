
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { PlayCircle, Bookmark } from "lucide-react";

export default function QuranPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">
          {t('quran_reader')}
        </h1>
        <div className="flex gap-2">
          <Select defaultValue="1">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t('select_surah')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1. {t('al_fatihah')}</SelectItem>
              <SelectItem value="2">2. {t('al_baqarah')}</SelectItem>
              <SelectItem value="18">18. {t('al_kahf')}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="1">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder={t('select_ayah')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ayah 1</SelectItem>
              <SelectItem value="2">Ayah 2</SelectItem>
              <SelectItem value="3">Ayah 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl text-primary">
              {t('al_fatihah')} (The Opening)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <PlayCircle className="h-6 w-6 text-accent" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-right">
            <p
              className="font-serif text-4xl leading-relaxed text-foreground"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              In the name of Allah, the Entirely Merciful, the Especially
              Merciful.
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-serif text-4xl leading-relaxed text-foreground"
              dir="rtl"
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              [All] praise is [due] to Allah, Lord of the worlds -
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-lg">
                {t('view_tafsir')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>
                  Ibn Jarir said, "The meaning of `Al-Hamdu Lillahi` is: all
                  thanks are due to Allah alone, other than all else that is
                  worshipped instead of Him, and other than all of His creation.
                  These thanks are due to Allah on account of the innumerable
                  favors and bounties that He has bestowed on His servants, that
                  only He knows the amount of."
                </p>
                <p>
                  "Allah's statement `Rabbil-`Alamin` means `the Lord of the
                  Worlds`. The word `Al-`Alamin` is the plural of `Al-`Alam`, which refers
                  to everything in existence, except for Allah."
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
