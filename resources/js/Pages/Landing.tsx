import '../../css/landing.css';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import Statistics from '@/Components/Landing/Statistics';
import HowItWorks from '@/Components/Landing/HowItWorks';
import Features from '@/Components/Landing/Features';
import InteractiveDemo from '@/Components/Landing/InteractiveDemo';
import UseCases from '@/Components/Landing/UseCases';
import Pricing from '@/Components/Landing/Pricing';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';
import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface LandingProps {
    totalLinks: number;
    totalUsers: number;
}

export default function Landing({ totalLinks, totalUsers }: LandingProps) {
    useEffect(() => {
        // Intersection Observer for fade-up animations
        const fadeItems = document.querySelectorAll('.fade-up');
        if (fadeItems.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            fadeItems.forEach((item) => observer.observe(item));
        }
    }, []);

    return (
        <div className="landing-page font-sans text-gray-900 antialiased">
            <Head>
                <title>Pendekin - Perpendek link. Bagikan lebih mudah.</title>
                <meta name="description" content="Pendekin mengubah URL panjang menjadi link pendek yang rapi, aman, dan bisa dilacak. Lengkap dengan analytics, custom alias, QR Code, dan API." />
            </Head>

            <Navbar />
            
            <main>
                <Hero />
                <Statistics totalLinks={totalLinks} totalUsers={totalUsers} />
                <HowItWorks />
                <Features />
                <InteractiveDemo />
                <UseCases />
                {/* <Pricing /> */}
                <CTA />
            </main>
            
            <Footer />

            {/* Toast for copy action */}
            <div className="toast" id="toast">
                <CheckCircle2 size={16} />
                <span>Copied!</span>
            </div>
        </div>
    );
}
