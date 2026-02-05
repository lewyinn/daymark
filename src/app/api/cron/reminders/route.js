import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import PushSubscription from "@/models/PushSubscription";
import webpush from "web-push";

webpush.setVapidDetails(
    'mailto:ridhokur102@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim(),
    process.env.VAPID_PRIVATE_KEY?.trim()
);

export async function GET(req) {
    const authHeader = req.headers.get('authorization');

    // Pastikan CRON_SECRET di Vercel/Local sama dengan yang di cron-job.org
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    await connectMongoDB();
    const currentTime = new Date(); // Pakai nama unik agar tidak bentrok

    console.log("Waktu sekarang (UTC):", currentTime.toISOString());

    // 1. Ambil task pending yang punya reminder
    const tasks = await Task.find({
        status: 'pending',
        reminders: { $exists: true, $ne: [] }
    });

    console.log(`Ditemukan ${tasks.length} task pending.`);

    for (const task of tasks) {
        const deadline = new Date(task.deadline);

        for (const minutesBefore of task.reminders) {
            // Cek apakah reminder ini sudah pernah dikirim
            if (task.remindersSent && task.remindersSent.includes(minutesBefore)) continue;

            const targetTime = new Date(deadline.getTime() - minutesBefore * 60000);

            // Cek apakah sudah masuk waktunya
            if (currentTime >= targetTime) {
                // Ambil SEMUA perangkat milik user ini
                const allSubscriptions = await PushSubscription.find({ userId: task.userId });

                if (allSubscriptions.length > 0) {
                    const payload = JSON.stringify({
                        title: minutesBefore === 0 ? "Waktunya Tugas!" : `${minutesBefore} Menit Lagi!`,
                        body: `Tugas: ${task.title}`,
                        url: `/dashboard/tasks`
                    });

                    console.log(`Mengirim notifikasi ke ${allSubscriptions.length} perangkat untuk user ${task.userId}`);

                    await Promise.all(allSubscriptions.map(sub =>
                        webpush.sendNotification(sub.subscription, payload)
                            .catch(async (err) => {
                                // Jika endpoint sudah mati (uninstalled/clear data)
                                if (err.statusCode === 410 || err.statusCode === 404) {
                                    await PushSubscription.deleteOne({ _id: sub._id });
                                    console.log(`Menghapus subscription mati: ${sub._id}`);
                                } else {
                                    console.error("WebPush Error:", err.statusCode);
                                }
                            })
                    ));

                    // Tandai bahwa reminder ini SUDAH terkirim agar tidak double di menit berikutnya
                    await Task.findByIdAndUpdate(task._id, {
                        $addToSet: { remindersSent: minutesBefore }
                    });
                }
            }
        }
    }
    return new Response("OK");
}