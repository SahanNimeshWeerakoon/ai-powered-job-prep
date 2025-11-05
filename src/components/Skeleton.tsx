import { cn } from "@/lib/utils";

export function Skeleton({ className }: {className?: string}) {
    return (
        <span className={cn("animate-pulse bg-muted rounded h-[1.25rem] w-full max-w-full inline-block align-bottom", className)} />
    );
}

export function SkeletonButton({ className }: {className?: string}) {
    return (
        <span className={cn("h-9", className)} />
    );
}