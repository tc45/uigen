"use client";

import { useTheme, type Theme } from "@/lib/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const themes: { value: Theme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "Default light theme" },
  { value: "dark", label: "Dark", description: "Dark background" },
  { value: "high-contrast", label: "High Contrast", description: "Maximum contrast for readability" },
  { value: "color-blind", label: "Color Blind", description: "Blue-orange palette, avoids red/green" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          title="Change theme"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="end">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-1">
          Theme
        </div>
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              theme === t.value && "bg-accent text-accent-foreground"
            )}
          >
            <Check
              className={cn("h-3.5 w-3.5 shrink-0", theme !== t.value && "invisible")}
            />
            <div className="text-left">
              <div className="font-medium leading-none">{t.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
            </div>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
