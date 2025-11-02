import { upsertUser, deleteUser } from "@/features/users/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const event = await verifyWebhook(request);

        switch(event.type) {
            case "user.created":
            case "user.updated": {
                const clerkData = event.data;
                const email = clerkData.email_addresses.find(e => e.id === clerkData.primary_email_address_id)?.email_address;
                if(!email) return new Response("No primary email found", { status: 400 });

                const {id, first_name, last_name, image_url, created_at, updated_at} = clerkData;
                await upsertUser({
                    id,
                    name: `${first_name} ${last_name}`,
                    email,
                    imageUrl: image_url,
                    createdAt: new Date(created_at),
                    updatedAt: new Date(updated_at)
                });
                return new Response("User upserted", { status: 200 });
            }
            case "user.deleted": {
                if(!event.data.id) return new Response("No user ID found", { status: 400 });
                await deleteUser(event.data.id);
                return new Response("User deleted", { status: 200 });
            }
            default:
                return new Response("webhook processed", { status: 200 });
        }
    } catch {
        return new Response("Invalid webhoook", { status: 400 });
    }
}