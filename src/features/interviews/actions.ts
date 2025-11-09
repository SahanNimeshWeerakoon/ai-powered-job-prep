"use server"

import getCurrentUser from "@/services/clerk/lib/getCurrentUser"
import { getJobInfo } from "../jobInfos/actions";
import { insertInterview, updateInterview as updateInterviewDb } from "./db";
import { cacheTag } from "next/cache";
import { getInterviewIdTag } from "./dbCache";
import { eq } from "drizzle-orm";
import { InterviewTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "../jobInfos/dbCache";
import { db } from "@/drizzle/db";

export async function createInterview(
    { jobInfoId }:
    { jobInfoId: string }
): Promise<{ error: true; message: string } | { error: false; id: string }> {
    const { userId } = await getCurrentUser({});
    
    if(userId == null) {
        return {
            error: true,
            message: "You don't have permission to do this"
        }
    }

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if(jobInfo == null) {
        return {
            error: true,
            message: "You don't have permission to do this"
        }
    }

    const interview = await insertInterview({ jobInfoId, duration: "00:00:00" });

    return { error: false, id: interview.id };

}

export async function updateInterview(
    id: string,
    data : {
        humeChatId?: string,
        duration?: string
    })
{
    const { userId } = await getCurrentUser({});
    if(userId == null) {
        return {
            error: true,
            message: "You don't have permission to do this"
        }
    }

    const interview = await getInterview(id, userId);
    if(interview == null) {
        return {
            error: true,
            message: "You don't have permission to do this"
        }
    }

    await updateInterviewDb(id, data);

    return { error : false };
}

export async function getInterview(id: string, userId: string) {
    "use cache"

    cacheTag(getInterviewIdTag(id));

    const interview = await db.query.InterviewTable.findFirst({
        where: eq(InterviewTable.id, id),
        with: {
            jobInfo: {
                columns: {
                    id: true,
                    userId: true
                }
            }
        }
    });

    if(interview === null) return null;

    cacheTag(getJobInfoIdTag(interview?.jobInfo.id));

    if(interview?.jobInfo.userId !== userId) return null;
}