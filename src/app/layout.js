import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Daymark", // Judul default jika halaman lain tidak punya judul
    template: "%s | Daymark", // Template judul (contoh: "Tasks | Daymark")
  },
  description: "Your all-in-one personal productivity workspace. Manage tasks, notes, and track your favorite movies & series efficiently.",
  
  keywords: ["productivity", "task manager", "movie tracker", "notes app", "personal dashboard", "Next.js"],
  
  // Penulis/Pembuat
  authors: [{ name: "lewyinnn" }],
  
  // ─── PENGATURAN LOGO (Favicon) ───
  icons: {
    icon: "/Logo.png",       // Logo yang muncul di tab browser
    shortcut: "/Logo.png",   // Icon shortcut
    apple: "/Logo.png",      // Icon saat di-add to home screen di iPhone/iPad
  },

  // ─── OPEN GRAPH (Tampilan saat link dishare di Sosmed/WA) ───
  openGraph: {
    title: "Daymark | Productivity Workspace",
    description: "Manage tasks, notes, and track your favorite movies & series efficiently.",
    url: "https://daymark.vercel.app", // Ganti dengan domain aslimu nanti
    siteName: "Daymark",
    images: [
      {
        url: "/Logo.png", // Gambar preview saat link dishare
        width: 800,
        height: 600,
        alt: "Daymark Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Pengaturan Robot (Google Search Console)
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="XkYQMyRxx-oTV-fMvdx76vXBFcM_fZqrOl6J_wdoFeo" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
