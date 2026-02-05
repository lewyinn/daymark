import { connectMongoDB } from "@/lib/mongodb";
import PushSubscription from "@/models/PushSubscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Cek kembali path ini
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("Push Subscribe Error: Session not found");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const subscription = await req.json();

        await connectMongoDB();

        await PushSubscription.findOneAndUpdate(
            {
                userId: session.user.id,
                "subscription.endpoint": subscription.endpoint
            },
            {
                userId: session.user.id,
                subscription
            },
            { upsert: true, new: true }
        );

        console.log("✅ Berhasil menyimpan/update subscription di MongoDB");
        return NextResponse.json({ message: "Subscription saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving subscription:", error);
        return NextResponse.json({ message: "Error saving subscription" }, { status: 500 });
    }
}