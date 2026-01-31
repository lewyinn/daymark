export default function robots() {
    const baseUrl = 'https://daymarkapp.vercel.app'; // Ganti dengan domain aslimu

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/sign-in/', '/sign-up/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}