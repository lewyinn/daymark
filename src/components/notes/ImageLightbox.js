'use client'

import { GrInstallOption } from "react-icons/gr";

export default function ImageLightbox({ url, onClose }) {
    const handleDownload = async () => {
        const response = await fetch(url)
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `image-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="absolute top-5 right-5 flex gap-4">
                <button
                    onClick={handleDownload}
                    className="py-3 px-4  bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                    title="Download Image">
                    <GrInstallOption />
                </button>
                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <img
                src={url}
                alt="Full Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            />
        </div>
    )
}