import { useEffect } from 'react';
import { Link2, Users, Activity, Star } from 'lucide-react';

interface StatisticsProps {
    totalLinks: number;
    totalUsers: number;
}

export default function Statistics({ totalLinks, totalUsers }: StatisticsProps) {
    useEffect(() => {
        const numbers = document.querySelectorAll('.stat-number');
        if (!numbers.length) return;

        const animate = (el: Element) => {
            const htmlEl = el as HTMLElement;
            const target = parseFloat(htmlEl.dataset.count || '0');
            const decimal = parseInt(htmlEl.dataset.decimal || '0', 10);
            const suffix = htmlEl.dataset.suffix || '';
            const duration = 1400;
            const start = performance.now();

            const step = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const current = target * eased;
                
                if (decimal > 0) {
                    htmlEl.textContent = current.toFixed(decimal) + suffix;
                } else {
                    htmlEl.textContent = Math.floor(current).toLocaleString('id-ID') + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    if (decimal > 0) {
                        htmlEl.textContent = target.toFixed(decimal) + suffix;
                    } else {
                        htmlEl.textContent = target.toLocaleString('id-ID') + suffix;
                    }
                }
            };

            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        numbers.forEach((el) => observer.observe(el));
    }, [totalLinks, totalUsers]);

    return (
        <section className="stats-section fade-up">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Link2 size={22} />
                    </div>
                    <span className="stat-number" data-count={totalLinks + 341} data-suffix="+">0</span>
                    <span className="stat-label">Link dibuat</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Users size={22} />
                    </div>
                    <span className="stat-number" data-count={totalUsers + 67} data-suffix="+">0</span>
                    <span className="stat-label">Pengguna</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Activity size={22} />
                    </div>
                    <span className="stat-number" data-count="99.9" data-decimal="1" data-suffix="%">0</span>
                    <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Star size={22} />
                    </div>
                    <span className="stat-number" data-count="4.9" data-decimal="1" data-suffix="/5">0</span>
                    <span className="stat-label">Rating</span>
                </div>
            </div>
        </section>
    );
}
