import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="cta-section" id="cta">
            <div className="cta-inner fade-up">
                <h2>Siap memperpendek link pertama kamu?</h2>
                <p>Gratis untuk mulai. Tidak perlu kartu kredit.</p>
                <Link href={route('register')} className="btn btn-cta">
                    <span>Mulai Gratis</span>
                    <ArrowRight size={17} />
                </Link>
            </div>
        </section>
    );
}

