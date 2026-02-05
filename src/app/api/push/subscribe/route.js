export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const subscription = await req.json();
        await connectMongoDB();

        // Cari berdasarkan userId DAN endpoint perangkat
        await PushSubscription.findOneAndUpdate(
            {
                userId: session.user.id,
                "subscription.endpoint": subscription.endpoint
            },
            { userId: session.user.id, subscription },
            { upsert: true }
        );

        return NextResponse.json({ message: "Device registered!" });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}