export default function SkeletonLoader({ className = 'h-6 w-full' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200/70 rounded-xl ${className}`} />
    );
}
