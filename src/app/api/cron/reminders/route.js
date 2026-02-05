import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import PushSubscription from "@/models/PushSubscription";
import webpush from "web-push";

webpush.setVapidDetails(
    'mailto:ridhokur102@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function GET(req) {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    await connectMongoDB();
    const now = new Date();

    console.log("Waktu sekarang:", now.toISOString());

    // 1. Ambil task pending yang punya reminder
    const tasks = await Task.find({ status: 'pending', reminders: { $exists: true, $ne: [] } });
    console.log("Jumlah task pending found:", tasks.length);

    for (const task of tasks) {
        const deadline = new Date(task.deadline);
        const now = new Date();

        for (const minutesBefore of task.reminders) {
            // 1. Cek apakah pengingat ini sudah pernah dikirim
            if (task.remindersSent && task.remindersSent.includes(minutesBefore)) continue;

            // 2. Hitung kapan notifikasi harusnya dikirim
            // minutesBefore = 0 berarti tepat waktu
            const targetTime = new Date(deadline.getTime() - minutesBefore * 60000);

            // 3. Kirim JIKA waktu sekarang sudah mencapai atau melewati targetTime
            if (now >= targetTime) {
                const userSub = await PushSubscription.findOne({ userId: task.userId });

                if (userSub) {
                    await webpush.sendNotification(userSub.subscription, JSON.stringify({
                        title: task.title,
                        body: minutesBefore === 0 ? "Waktunya sekarang!" : `${minutesBefore} menit lagi!`,
                        url: "/dashboard/tasks"
                    }));

                    // 4. Update agar tidak double kirim
                    await Task.findByIdAndUpdate(task._id, {
                        $addToSet: { remindersSent: minutesBefore }
                    });
                    console.log(`Notifikasi terkirim untuk: ${task.title}`);
                }
            }
        }
    }
    return new Response("OK");
}