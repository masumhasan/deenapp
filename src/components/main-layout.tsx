
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  HandHeart,
  Home,
  Menu,
  Moon,
  Landmark,
  Repeat,
  Sparkles,
  Languages,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function NavContent() {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/prayer-times", label: t('prayer_times'), icon: Landmark },
    { href: "/quran", label: t('quran_reader'), icon: BookOpen },
    { href: "/duas", label: t('dua_library'), icon: HandHeart },
    { href: "/tasbih", label: t('tasbih_counter'), icon: Repeat },
    { href: "/calendar", label: t('hijri_calendar'), icon: Calendar },
    { href: "/assistant", label: t('ai_assistant'), icon: Sparkles },
  ];

  return (
    <nav className="flex flex-col gap-4 p-4">
      <Link href="/" className="flex items-center gap-2 mb-4">
         <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
        <h1 className="text-2xl font-headline font-bold text-primary">
          DeenStream
        </h1>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === item.href && "bg-accent/50 text-primary"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRamadanMode, toggleRamadanMode } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <NavContent />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <NavContent />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search bar here later */}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={(value) => setLanguage(value as 'bn' | 'en' | 'hi')}
              >
                <DropdownMenuRadioItem value="bn">বাংলা</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="hi">हिंदी</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <Label htmlFor="ramadan-mode" className="sr-only">
              Ramadan Mode
            </Label>
            <Switch
              id="ramadan-mode"
              checked={isRamadanMode}
              onCheckedChange={toggleRamadanMode}
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
