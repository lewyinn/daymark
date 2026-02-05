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
            if (task.remindersSent && task.remindersSent.includes(minutesBefore)) continue;

            const targetTime = new Date(deadline.getTime() - minutesBefore * 60000);

            if (now >= targetTime) {
                const allSubscriptions = await PushSubscription.find({ userId: task.userId });

                if (allSubscriptions.length > 0) {
                    const payload = JSON.stringify({
                        title: minutesBefore === 0 ? "Waktunya Tugas!" : `${minutesBefore} Menit Lagi!`,
                        body: `Tugas: ${task.title}`,
                        url: `/dashboard/tasks`
                    });

                    await Promise.all(allSubscriptions.map(sub =>
                        webpush.sendNotification(sub.subscription, payload)
                            .catch(async (err) => {
                                if (err.statusCode === 410 || err.statusCode === 404) {
                                    await PushSubscription.deleteOne({ _id: sub._id });
                                    console.log("Menghapus subscription mati.");
                                }
                            })
                    ));

                    await Task.findByIdAndUpdate(task._id, {
                        $addToSet: { remindersSent: minutesBefore }
                    });
                }
            }
        }
    }
    return new Response("OK");
}