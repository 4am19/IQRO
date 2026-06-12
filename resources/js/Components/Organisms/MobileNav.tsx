import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { href: '/',                emoji: '🏠', label: 'Beranda', colorClass: 'btn-sunshine' },
    { href: '/learn',           emoji: '📖', label: 'Belajar', colorClass: 'btn-ocean' },
    { href: '/game/select',     emoji: '🎮', label: 'Bermain', colorClass: 'btn-candy' },
];

export default function MobileNav() {
    const { url } = usePage();
    const isActive = (href: string) => href === '/' ? url === '/' : url.startsWith(href);

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 md:hidden pointer-events-none flex justify-center px-6">
            <nav className="bg-white/90 backdrop-blur-xl border-[4px] border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-full px-8 py-3.5 flex justify-between items-center gap-8 pointer-events-auto">
                {navItems.map(({ href, emoji, label, colorClass }) => {
                    const active = isActive(href);
                    return (
                        <Link key={href} href={href} className="flex flex-col items-center gap-1 group relative">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                                active 
                                    ? `${colorClass} scale-[1.15] shadow-xl ring-4 ring-white/60 -translate-y-3 z-10` 
                                    : 'bg-slate-100 text-slate-500 border-[3px] border-white shadow-inner group-hover:scale-110 group-hover:bg-white group-hover:shadow-md group-hover:-translate-y-2'
                            }`}>
                                <span className="filter drop-shadow-sm">{emoji}</span>
                            </div>
                            <span className={`text-[10px] font-black transition-all duration-300 absolute -bottom-5 whitespace-nowrap uppercase tracking-wider ${
                                active ? 'text-indigo-700 opacity-100 translate-y-0' : 'text-slate-400 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                            }`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
