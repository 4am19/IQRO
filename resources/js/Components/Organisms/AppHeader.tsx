import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const navLinks = [
    { href: '/',            label: 'Beranda', icon: '🏠', colorClass: 'btn-sunshine' },
    { href: '/learn',       label: 'Belajar', icon: '📖', colorClass: 'btn-ocean' },
    { href: '/game/select', label: 'Bermain', icon: '🎮', colorClass: 'btn-candy' },
];

export default function AppHeader() {
    const { url } = usePage<any>();
    const isActive = (href: string) => href === '/' ? url === '/' : url.startsWith(href);

    return (
        <header className="sticky top-4 z-40 px-4 md:px-8 transition-all">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">

                {/* ── Logo (outside navbar pill) ── */}
                <Link href="/" className="shrink-0 hover:scale-105 active:scale-95 transition-transform duration-300">
                    <img
                        src="/images/logo_pintar_mengaji.png"
                        alt="Pintar Mengaji"
                        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain drop-shadow-xl"
                    />
                </Link>

                {/* ── Navbar Pill (icons only) ── */}
                <nav className="bg-white/85 backdrop-blur-xl border-[3px] border-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.1)] rounded-full px-3 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2 sm:gap-3 transition-all hover:shadow-[0_16px_40px_rgba(99,102,241,0.2)]">
                    {navLinks.map(({ href, label, icon, colorClass }) => {
                        const active = isActive(href);
                        return (
                            <Link key={href} href={href}
                                className={`relative group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-black text-sm transition-all duration-300 ${
                                    active
                                        ? `${colorClass} shadow-lg scale-105 ring-3 ring-white/50`
                                        : 'bg-slate-100/80 text-slate-500 border-2 border-slate-200/50 hover:bg-white hover:text-indigo-600 hover:scale-105 hover:shadow-md hover:-translate-y-0.5'
                                }`}
                            >
                                <span className="text-xl sm:text-2xl filter drop-shadow-sm">{icon}</span>
                                <span className="hidden sm:inline text-xs sm:text-sm">{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
