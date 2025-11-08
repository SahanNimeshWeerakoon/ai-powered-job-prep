import { getJobInfo } from "@/features/jobInfos/actions";
import getCurrentUser from "@/services/clerk/lib/getCurrentUser";
import { Loader2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchAccessToken } from "hume";
import { env } from "@/data/env/server";
import { VoiceProvider } from "@humeai/voice-react";
import { StartCall } from "./_StartCall";

export default async function Page({params}: { params: Promise<{jobInfoId: string}> }) {
    const { jobInfoId } = await params;
    return (
        <Suspense fallback={
            <div className="h-screen-header flex items-center justify-center">
                <Loader2Icon className="animate-spin size-24" />
            </div>
        }>
            <SuspendedComponent jobInfoId={jobInfoId} />
        </Suspense>
    );
}

async function SuspendedComponent({ jobInfoId }: { jobInfoId: string }) {
    const { userId, redirectToSignIn, user } = await getCurrentUser({ allData: true });
    if(userId == null || user == null) return redirectToSignIn();

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if(jobInfo == null) return notFound();

    const accessToken = await fetchAccessToken({
        apiKey: String(env.HUME_API_KEY),
        secretKey: String(env.HUME_SECRET_KEY),
    });

    return (
        <VoiceProvider>
            <StartCall jobInfo={jobInfo} user={user} accessToken={accessToken} />
        </VoiceProvider>
    );
}