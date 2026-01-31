export default function sitemap() {
    const baseUrl = 'https://daymarkapp.vercel.app'; 

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ]
}