import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Button from '@/Components/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeCard() {
    const user = usePage<PageProps>().props.auth.user;

    return (
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-lg mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 right-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
                        <Sparkles size={16} /> Welcome back!
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        Halo, {user.name.split(' ')[0]} 👋
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl">
                        Siap untuk memperpendek link baru hari ini? Kamu memiliki 34 sisa kuota link bulan ini.
                    </p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto">
                    <Button variant="secondary" className="w-full md:w-auto bg-white text-primary hover:bg-gray-50 shadow-md">
                        Upgrade Pro <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
