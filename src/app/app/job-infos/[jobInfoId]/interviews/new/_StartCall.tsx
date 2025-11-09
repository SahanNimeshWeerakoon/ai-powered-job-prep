"use client"

import { Button } from "@/components/ui/button";
import { env } from "@/data/env/client";
import { JobInfoTable } from "@/drizzle/schema";
import { createInterview, updateInterview } from "@/features/interviews/actions";
import { errorToast } from "@/lib/errorToast";
import { CondensedMessage } from "@/services/hume/components/CondensedMessages";
import { condensedChatMessages } from "@/services/hume/lib/condensedChatMessages";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
    const  { connect, readyState, chatMetadata, callDurationTimestamp } = useVoice();
    const [interviewId, setInterviewId] = useState<string | null>(null);

    const durationRef = useRef(callDurationTimestamp);
    const router = useRouter();

    useEffect(() => { durationRef.current = callDurationTimestamp; }, [callDurationTimestamp]);

    // Update interview with humeChatId when chatMetadata changes
    useEffect(() => {
        if(chatMetadata?.chatId == null || interviewId == null) return;
        
        updateInterview(interviewId, { humeChatId: chatMetadata.chatId });
    }, [chatMetadata?.chatId, interviewId]);

    // Auto-save duration every 10 seconds
    useEffect(() => {
        if(interviewId == null) return;

        const intervalId = setInterval(() => {
            if(durationRef.current == null) return;
            updateInterview(interviewId, { duration: durationRef.current });
        }, 10000);

        return () => clearInterval(intervalId);
    }, [interviewId]);

    useEffect(() => {
        if(readyState !== VoiceReadyState.CLOSED) return;
        if(interviewId == null) return router.push(`/app/job-infos/${jobInfo.id}/interviews/`);

        if(durationRef.current != null) {
            updateInterview(interviewId, { duration: durationRef.current });
        }

        router.push(`/app/job-infos/${jobInfo.id}/interviews/${interviewId}`);
    }, [interviewId, readyState, jobInfo.id, router]);
    
    if(readyState === VoiceReadyState.IDLE) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Button size="lg" onClick={async () => {
                    const res = await createInterview({ jobInfoId: jobInfo.id });

                    if(res.error) return errorToast(res.message);

                    setInterviewId(res.id);

                    await connect({
                        auth: {
                            type: "accessToken",
                            value: accessToken
                        },
                        configId: env.NEXT_PUBLIC_HUME_CONFIG_ID,
                        sessionSettings: {
                            type: "session_settings",
                            variables: JSON.stringify({
                                userName: String(user.name || "Guest"),
                                title: String(jobInfo.title || "Not Specified"),
                                description: String(jobInfo.description || ""),
                                experienceLevel: String(jobInfo.experienceLevel || "")
                            }) as unknown as Record<string, string>
                        }
                    });
                }}>Start Interview</Button>
            </div>
        );
    }

    if(readyState === VoiceReadyState.CONNECTING || readyState === VoiceReadyState.CLOSED) {
        return <div className="h-screen flex items-center justify-center">
            <Loader2Icon className="animate-spin size-24" />
        </div>;
    }

    return <div className="overflow-y-auto h-screen flex flex-col-reverse">
        <div className="container py-6 flex flex-col items-center">
            <Messages user={user}/>
            <Controls />
        </div>
    </div>;
}

function Messages({ user }: { user: { name: string; imageUrl: string } }) {
    const { messages, fft } = useVoice();
    const condensedMessages = useMemo(() => {
        return condensedChatMessages(messages)
    }, [messages]);

    return <CondensedMessage messages={condensedMessages} user={user} maxFft={Math.max(...fft)} />;
}

function Controls() {
    const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } = useVoice();

    return (
        <div className="flex gap-5 rounded border px-5 py-2 w-fut sticky bottom-6 bg-backgorund items-center">
            <Button
                variant="ghost"
                size="icon"    
                className="-mx-3"
                onClick={() => (isMuted ? unmute() : mute())}
            >
                { isMuted ? <MicOffIcon /> : <MicIcon />}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            <div className="self-stretch">
                <FftVisualizer fft={micFft} />
            </div>
            <div className="text-sm text-muted-foreground tabular-nums">
                {callDurationTimestamp}
            </div>
            <Button variant="ghost" size="icon" className="-mx-3" onClick={disconnect}>
                <PhoneOffIcon className="text-desctructive" />
                <span className="sr-only">End Call</span>
            </Button>
        </div>
    );
}

function FftVisualizer({ fft }: { fft: number[] }) {
    return (
        <div className="flex gap-1 items-center h-full">
            {fft.map((value, index) => {
                const percent = (value / 4) * 100
                return <div key={index} className="min-h-0.5 bg-primary/75 w-0.5 rounded" style={{ height: `${percent < 10 ? '0' : percent}%` }} />;
            })}
            {/* <div className="h-full bg-primary" style={{width: `${Math.min(100, Math.max(0, fft[0] * 100))}%`}} /> */}
        </div>
    );
}