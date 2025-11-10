"use client"
import { BookOpenIcon, BrainCircuitIcon, FileSlidersIcon, SpeechIcon } from "lucide-react"
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
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navLinks = [
    { name: "Interviews", href: "interviews", Icon: SpeechIcon },
    { name: "Questions", href: "questions", Icon: BookOpenIcon },
    { name: "Resume", href: "resume", Icon: FileSlidersIcon },
]

export function Navbar({user}: {user: {name: string; imageUrl: string}}) {
    const { openUserProfile } = useClerk();
    const { jobInfoId } = useParams();
    const pathName = usePathname();

    return (
        <header className="h-[var(--header-height)] border-b">
            <nav className="container h-full flex items-center justify-between">
                <Link href="/app" className="flex items-center gap-2 font-semibold">
                    <BrainCircuitIcon className="w-6 h-6" />
                    <span>Landr</span>
                </Link>

                <div className="flex items-center gap-4">
                    { typeof jobInfoId === "string" && 
                        navLinks.map(({ name, href, Icon }) => {
                            const hrefPath = `/app/job-infos/${jobInfoId}/${href}`;
                            const isActive = pathName === hrefPath;
                            return (
                                <Button key={name} variant={isActive ? "secondary" : "ghost"} asChild className="cursor-pointer sm:block hidden">
                                    <Link href={hrefPath}>
                                        <Icon />
                                        {name}
                                    </Link>
                                </Button>
                            );
                        })
                    }

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