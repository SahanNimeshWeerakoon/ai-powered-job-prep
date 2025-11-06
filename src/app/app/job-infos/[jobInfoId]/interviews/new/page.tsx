import { getJobInfo } from "@/features/jobInfos/actions";
import getCurrentUser from "@/services/clerk/lib/getCurrentUser";
import { Loader2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
}