"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = ["Light", "Dark", "System"] as const;

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, []);

  if(!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent">
          {resolvedTheme === "dark" ? <Moon /> : <Sun />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeVal) => (
            <DropdownMenuItem key={themeVal} onClick={() => setTheme(themeVal.toLocaleLowerCase())} className={cn("cursor-pointer", theme === themeVal.toLocaleLowerCase() && "bg-accent text-accent-foreground")}>
                {themeVal}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
