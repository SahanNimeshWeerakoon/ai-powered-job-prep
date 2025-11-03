import { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar({ user, ...props }: { user: { name: string; imageUrl: string } & ComponentProps<typeof Avatar> }) {
    return (
        <Avatar {...props}>
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback>
                { user.name.split(" ").map(n => n[0]).join("").toUpperCase() }
            </AvatarFallback>
        </Avatar>
    );
}