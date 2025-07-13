
"use client";
import { useTheme } from "@/context/theme-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Moon } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function RamadanCard() {
    const { isRamadanMode } = useTheme();
    const { t } = useLanguage();
    
    if (!isRamadanMode) {
        return null;
    }

    return (
        <Card className="bg-primary/10 border-primary/20 shadow-lg transition-all duration-300 ease-in-out">
            <CardHeader>
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                    <Moon className="w-6 h-6 text-accent" /> {t('ramadan_kareem')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-around items-center">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t('suhoor')}</p>
                        <p className="text-xl font-bold font-headline text-primary">04:30 AM</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t('iftar')}</p>
                        <p className="text-xl font-bold font-headline text-primary">06:45 PM</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-headline font-semibold mb-1 text-primary">{t('daily_tip')}</h4>
                    <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                        {t('ramadan_quote')}
                        <cite className="block not-italic mt-2 text-sm">{t('ramadan_quote_cite')}</cite>
                    </blockquote>
                </div>
            </CardContent>
        </Card>
    );
}
