interface AvatarProps {
    name: string;
    src?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    role?: string;
}

export default function Avatar({ name, src, size = 'md', role }: AvatarProps) {
    const sizeMap = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const avatarUrl = src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`;

    return (
        <div className="relative inline-block shrink-0">
            <div className={`${sizeMap[size]} rounded-full border border-gray-200/80 overflow-hidden bg-emerald-500 text-white font-bold flex items-center justify-center shadow-sm`}>
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>
            {role === 'admin' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full" title="Admin User" />
            )}
        </div>
    );
}
