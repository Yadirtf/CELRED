export default function LoadingSpinner({ className = '' }: { className?: string }) {
    return (
        <div className={`flex justify-center items-center ${!className.includes('min-h') ? 'min-h-[80vh]' : ''}`}>
            <div className={`animate-spin rounded-full border-t-4 border-b-4 border-blue-600 ${className}`} />
        </div>
    );
}
