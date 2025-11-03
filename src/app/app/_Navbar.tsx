"use client"
import { BrainCircuitIcon } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { UserAvatar } from "@/features/users/components/UserAvatar"

export function Navbar({user}: {user: {name: string; imageUrl: string}}) {
    const { openUserProfile } = useClerk()

    return (
        <header className="h-[var(--header-height)] border-b">
            <nav className="container h-full flex items-center justify-between">
                <Link href="/app" className="flex items-center gap-2 font-semibold">
                    <BrainCircuitIcon className="w-6 h-6" />
                    <span>Landr</span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <UserAvatar user={user} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openUserProfile()}>
                                Profile
                            </DropdownMenuItem>
                            <SignOutButton>
                                <DropdownMenuItem  className="text-destructive focus:text-destructive">
                                    Logout
                                </DropdownMenuItem>
                            </SignOutButton>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    )
}