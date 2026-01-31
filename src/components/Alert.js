export default function Alert({ type = 'success', message }) {
    const styles = {
        success: {
            bg: 'bg-green-50 border-green-200',
            icon: 'text-green-600',
            text: 'text-green-800',
            iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            icon: 'text-red-600',
            text: 'text-red-800',
            iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-200',
            icon: 'text-yellow-600',
            text: 'text-yellow-800',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-600',
            text: 'text-blue-800',
            iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    }

    const style = styles[type] || styles.success

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4 animate-slide-down`}>
            <div className={`${style.bg} border rounded-2xl p-4 shadow-lg flex items-center gap-3`}>
                <svg
                    className={`w-6 h-6 ${style.icon} flex-shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
                </svg>
                <p className={`${style.text} text-sm font-medium flex-1`}>{message}</p>
            </div>
        </div>
    )
}