import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
import { JobInfoForm } from "@/features/jobInfos/JobInfoForm";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import getCurrentUser from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="h-screen-header flex items-center justify-center">
                    <Loader2Icon className="size-24 animate-spin" />
                </div>       
            }
        >
            <JobInfos />      
        </Suspense>
    );
}

async function JobInfos() {
    const { userId, redirectToSignIn } = await getCurrentUser({});
    if(userId == null) return redirectToSignIn();

    const jobInfos = await getJobInfos(userId);

    if(!jobInfos.length) return <NoJobInfos />

    return (
        <div className="container my-4">
            <div className="flex gap-2 justify-between mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">Select a Job Description</h1>
                <Button variant="outline">
                    <Link href="/app/job-infos/new" className="flex items-center justify-around">
                        <PlusIcon />
                        CreateNew Job Description
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap0-6">
                {jobInfos.map(jobInfo => (
                    <Link key={jobInfo.id} href={`/app/job-infos/${jobInfo.id}`}>
                        <Card className="h-full">
                            <div className="flex items-center justify-between h-full">
                                <div className="space-y-4 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {jobInfo.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground line-clamp-3">
                                        {jobInfo.description}
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Badge>
                                            {formatExperienceLevel(jobInfo.experienceLevel)}
                                        </Badge>
                                        {jobInfo.title && <Badge>{jobInfo.title}</Badge>}
                                    </CardFooter>
                                </div>
                                <CardContent>
                                    <ArrowRightIcon className="size-6" />
                                </CardContent>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function NoJobInfos() {
    return (
        <div className="container my-4 max-w-5xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">Welcome to Landr</h1>
            <p className="mt-2 text-muted-foreground mb-8">
                To get started, enter information about the type of job you are wanting to apply for. This can be specific information copied directly from a job listing or general information such as the tech stack you want to work in. The more specific you are in the description the closer the test interviews will be to the real thing.
            </p>
            <Card>
                <CardContent>
                    <JobInfoForm />
                </CardContent>
            </Card>
        </div>
    );
}

async function getJobInfos(userId: string) {
    "use cache"
    cacheTag(getJobInfoUserTag(userId));

    return db.query.JobInfoTable.findMany({
        where: eq(JobInfoTable.userId, userId),
        orderBy: desc(JobInfoTable.updatedAt)
    });
}