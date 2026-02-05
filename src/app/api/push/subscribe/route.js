import { connectMongoDB } from "@/lib/mongodb";
import PushSubscription from "@/models/PushSubscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const subscription = await req.json();
        await connectMongoDB();

        // Gunakan findOneAndUpdate agar satu user hanya punya satu subscription aktif
        await PushSubscription.findOneAndUpdate(
            { userId: session.user.id },
            { userId: session.user.id, subscription },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Subscription saved successfully!" });
    } catch (error) {
        return NextResponse.json({ message: "Error saving subscription" }, { status: 500 });
    }
}