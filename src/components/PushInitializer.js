'use client'

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PushInitializer() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session && 'serviceWorker' in navigator && 'PushManager' in window) {
            registerPush();
        }
    }, [session]);

    async function registerPush() {
        try {
            // 1. Daftarkan Service Worker
            const registration = await navigator.serviceWorker.register('/sw.js');

            // 2. Minta izin notifikasi
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return;

            // 3. Ambil/Buat Subscription
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)            
            });

            // 4. Kirim ke API kita
            await fetch('/api/push/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Push Notification Ready!");
        } catch (error) {
            console.error("Gagal registrasi push:", error);
        }
    }

    // Helper function untuk konversi key
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    return null; // Komponen ini tidak perlu render apa-apa
}