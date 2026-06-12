import React from 'react';

interface Props {
    type: string;
    className?: string;
}

/**
 * Ilustrasi SVG anak-anak untuk contoh kata huruf hijaiyah
 */
export default function KidsIllustration({ type, className = 'w-20 h-20' }: Props) {
    const base = 'select-none drop-shadow-md transition-transform hover:scale-105 duration-200';

    switch (type) {
        case 'apple':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <path d="M50 25 C40 20,25 25,25 45 C25 70,45 85,50 85 C55 85,75 70,75 45 C75 25,60 20,50 25Z" fill="#ef4444" />
                    <path d="M50 25 C45 22,35 25,33 40 C33 55,45 75,50 81" fill="#f87171" opacity="0.4" />
                    <path d="M50 25 Q52 10,58 10" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M52 20 Q65 15,65 25 Q55 28,52 20Z" fill="#22c55e" />
                    <ellipse cx="38" cy="38" rx="4" ry="8" fill="white" transform="rotate(-15 38 38)" opacity="0.8" />
                </svg>
            );
        case 'house':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <polygon points="50,15 90,48 10,48" fill="#f43f5e" />
                    <rect x="20" y="48" width="60" height="42" fill="#38bdf8" rx="6" />
                    <rect x="42" y="62" width="16" height="28" fill="#eab308" rx="3" />
                    <circle cx="46" cy="76" r="2.5" fill="#1e293b" />
                    <rect x="28" y="55" width="12" height="12" fill="white" rx="2" />
                    <line x1="34" y1="55" x2="34" y2="67" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="28" y1="61" x2="40" y2="61" stroke="#38bdf8" strokeWidth="2" />
                </svg>
            );
        case 'crown':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <polygon points="10,75 90,75 95,30 70,55 50,20 30,55 5,30" fill="#fbbf24" stroke="#d97706" strokeWidth="3" strokeLinejoin="round" />
                    <rect x="20" y="68" width="60" height="7" fill="#f59e0b" rx="2" />
                    <circle cx="50" cy="20" r="5" fill="#ef4444" />
                    <circle cx="5" cy="30" r="5" fill="#3b82f6" />
                    <circle cx="95" cy="30" r="5" fill="#10b981" />
                </svg>
            );
        case 'shirt':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <path d="M25 25 L35 15 L50 25 L65 15 L75 25 L88 45 L75 48 L75 88 L25 88 L25 48 L12 45Z" fill="#06b6d4" />
                    <circle cx="50" cy="42" r="3.5" fill="#facc15" />
                    <circle cx="50" cy="58" r="3.5" fill="#facc15" />
                </svg>
            );
        case 'camel':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <ellipse cx="48" cy="62" rx="22" ry="15" fill="#d97706" />
                    <circle cx="40" cy="45" r="9" fill="#d97706" />
                    <path d="M64 62 Q74 58,74 36" stroke="#d97706" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <ellipse cx="76" cy="32" rx="9" ry="6" fill="#d97706" />
                    <rect x="35" y="74" width="4.5" height="18" fill="#d97706" rx="2" />
                    <rect x="50" y="74" width="4.5" height="18" fill="#d97706" rx="2" />
                    <circle cx="78" cy="30" r="2" fill="#1e293b" />
                </svg>
            );
        case 'rope':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <path d="M20 30 Q50 10,80 30 Q50 50,20 70 Q50 90,80 70" stroke="#92400e" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <circle cx="20" cy="30" r="6" fill="#b45309" />
                    <circle cx="80" cy="70" r="6" fill="#b45309" />
                </svg>
            );
        case 'ring':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <ellipse cx="50" cy="70" rx="28" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
                    <ellipse cx="50" cy="56" rx="28" ry="12" fill="#fcd34d" stroke="#d97706" strokeWidth="4" />
                    <ellipse cx="50" cy="42" rx="16" ry="16" fill="#818cf8" stroke="#6366f1" strokeWidth="3" />
                    <ellipse cx="50" cy="40" rx="10" ry="10" fill="#a5b4fc" opacity="0.7" />
                    <ellipse cx="46" cy="37" rx="3" ry="4" fill="white" opacity="0.6" />
                </svg>
            );
        case 'notebook':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <rect x="22" y="18" width="56" height="68" fill="#818cf8" rx="6" />
                    <rect x="28" y="14" width="50" height="68" fill="#e0e7ff" rx="4" />
                    <line x1="36" y1="32" x2="70" y2="32" stroke="#818cf8" strokeWidth="2" />
                    <line x1="36" y1="42" x2="70" y2="42" stroke="#818cf8" strokeWidth="2" />
                    <line x1="36" y1="52" x2="60" y2="52" stroke="#818cf8" strokeWidth="2" />
                    <rect x="22" y="30" width="6" height="40" fill="#f43f5e" />
                    <circle cx="25" cy="40" r="2.5" fill="white" />
                    <circle cx="25" cy="52" r="2.5" fill="white" />
                </svg>
            );
        case 'book':
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <rect x="18" y="25" width="64" height="52" fill="#854d0e" rx="6" />
                    <rect x="23" y="20" width="54" height="52" fill="#ca8a04" rx="4" />
                    <path d="M23 72 L77 72 L77 76 L23 76Z" fill="#e2e8f0" />
                    <path d="M47 20 L53 20 L53 65 L47 62Z" fill="#ef4444" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 100 100" className={`${base} ${className}`}>
                    <circle cx="50" cy="50" r="35" fill="#f59e0b" />
                    <text x="50" y="60" textAnchor="middle" fontSize="32" fill="white">?</text>
                </svg>
            );
    }
}
