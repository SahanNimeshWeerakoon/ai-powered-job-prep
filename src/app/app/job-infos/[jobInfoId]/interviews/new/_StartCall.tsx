"use client"

import { Button } from "@/components/ui/button";
import { env } from "@/data/env/client";
import { JobInfoTable } from "@/drizzle/schema";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

export function StartCall(
    { jobInfo, user, accessToken }:
    {
        accessToken: string,
        jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "title" | "description" | "experienceLevel">,
        user: {
            name: string;
            imageUrl: string;
        }
    }
) {
    const  { connect, readyState, disconnect, error } = useVoice();
    
    // if(readyState === VoiceReadyState.IDLE) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <Button size="lg" onClick={async () => {
    //                 await connect({
    //                     auth: {
    //                         type: "accessToken",
    //                         value: accessToken
    //                     },
    //                     configId: env.NEXT_PUBLIC_HUME_CONFIG_ID,
    //                     sessionSettings: {
    //                         type: "session_settings",
    //                         variables: JSON.stringify({
    //                             userName: String(user.name || "Guest"),
    //                             title: String(jobInfo.title || "Not Specified"),
    //                             description: String(jobInfo.description || ""),
    //                             experienceLevel: String(jobInfo.experienceLevel || "")
    //                         }) as unknown as Record<string, string>
    //                     }
    //                 });
    //             }}>Start Interview</Button>
    //         </div>
    //     );
    // }

    // if(readyState === VoiceReadyState.CONNECTING || readyState === VoiceReadyState.CLOSED) {
    //     return <div className="h-screen flex items-center justify-center">
    //         <Loader2Icon className="animate-spin size-24" />
    //     </div>;
    // }

    return <div className="overflow-y-auto h-screen flex flex-col-reverse">
        <div className="container py-6 flex flex-col items-center">
            <Messages />
            <Controls />
        </div>
    </div>;
}

function Messages() {
    return null;
}

function Controls() {
    const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } = useVoice();

    return (
        <div className="flex gap-5 rounded border px-5 py-2 w-fut sticky bottom-6 bg-backgorund items-center">
            asfd
        </div>
    );
}