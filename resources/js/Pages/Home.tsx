import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import MascotHufi from '@/Components/MascotHufi';
import MobileNav from '@/Components/Organisms/MobileNav';
import { useBGM } from '@/Hooks/useBGM';

interface Props { auth: { user: { id: number; name: string } | null }; }

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface SparkleData {
    id: number; x: number; y: number; color: string; size: number; emoji: string;
}
interface TappedLetter {
    id: number; x: number; y: number; char: string; color: string;
}

const SPARKLE_COLORS = ['#fde68a', '#a5b4fc', '#fca5a5', '#86efac', '#f9a8d4', '#fcd34d', '#c4b5fd', '#67e8f9'];
const SPARKLE_EMOJIS = ['⭐', '✨', '🌟', '💫', '🎉', '🎊', '💖', '🦋'];
const HIJAIYAH_CHARS = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

const MASCOT_MESSAGES = [
    "Assalamu'alaikum! 👋",
    'Ayo belajar huruf hijaiyah! ✨',
    'Kamu pasti bisa! 💪',
    'Semangat belajar! 🌟',
    'Huruf hijaiyah itu seru lho! 🎉',
    'Bismillah, yuk mulai! 📖',
    'Hufi sayang kamu! 💜',
    'Raih bintangnya! ⭐',
    'Klik Hufi lagi dong! 🦉',
    'MasyaAllah, hebat! 🏆',
];

const FEATURE_ITEMS = [
    { emoji: '📖', label: 'Belajar', sub: 'Menyenangkan', gradient: 'from-sky-400 to-blue-500', glow: 'rgba(56,189,248,0.4)' },
    { emoji: '🎮', label: 'Game', sub: 'Interaktif', gradient: 'from-violet-400 to-purple-500', glow: 'rgba(167,139,250,0.4)' },
    { emoji: '🏆', label: 'Raih', sub: 'Bintang', gradient: 'from-amber-400 to-orange-500', glow: 'rgba(251,191,36,0.4)' },
    { emoji: '🎁', label: 'Dapatkan', sub: 'Hadiah', gradient: 'from-pink-400 to-rose-500', glow: 'rgba(251,113,133,0.4)' },
];

/* ── Inline SVG Components ─────────────────────────────────────────────────── */

function MosqueSVG({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 220 200" className={className} aria-hidden>
            <path d="M60 120 Q60 60,110 40 Q160 60,160 120Z" fill="#c7a44e" opacity="0.85" />
            <path d="M60 120 Q60 70,110 50 Q160 70,160 120Z" fill="#d4b366" opacity="0.7" />
            <rect x="30" y="65" width="14" height="75" fill="#c7a44e" rx="3" opacity="0.8" />
            <path d="M30 65 Q37 40,44 65Z" fill="#6366f1" opacity="0.7" />
            <circle cx="37" cy="45" r="3" fill="#fbbf24" />
            <rect x="176" y="65" width="14" height="75" fill="#c7a44e" rx="3" opacity="0.8" />
            <path d="M176 65 Q183 40,190 65Z" fill="#6366f1" opacity="0.7" />
            <circle cx="183" cy="45" r="3" fill="#fbbf24" />
            <rect x="45" y="120" width="130" height="50" fill="#b8963e" rx="4" opacity="0.8" />
            <rect x="68" y="128" width="16" height="22" fill="#fef3c7" rx="8" opacity="0.6" />
            <rect x="102" y="128" width="16" height="22" fill="#fef3c7" rx="8" opacity="0.6" />
            <rect x="136" y="128" width="16" height="22" fill="#fef3c7" rx="8" opacity="0.6" />
            <path d="M95 170 Q110 148,125 170Z" fill="#92400e" opacity="0.7" />
            <circle cx="110" cy="38" r="5" fill="#fbbf24" />
            <circle cx="112" cy="36" r="4" fill="#c7a44e" />
        </svg>
    );
}

function LanternSVG({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 60 100" className={className} aria-hidden>
            <line x1="30" y1="0" x2="30" y2="20" stroke="#fbbf24" strokeWidth="2" />
            <path d="M20 20 L40 20 L38 28 L22 28Z" fill="#d97706" />
            <path d="M22 28 Q18 50,22 72 L38 72 Q42 50,38 28Z" fill="#fef3c7" opacity="0.8" />
            <ellipse cx="30" cy="50" rx="8" ry="16" fill="#fbbf24" opacity="0.5" />
            <ellipse cx="30" cy="50" rx="4" ry="10" fill="#fde68a" opacity="0.8" />
            <path d="M22 72 L38 72 L35 78 L25 78Z" fill="#d97706" />
            <circle cx="30" cy="80" r="3" fill="#b45309" />
        </svg>
    );
}

function MoonSVG({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden>
            <circle cx="40" cy="40" r="30" fill="#fde68a" />
            <circle cx="50" cy="32" r="25" fill="#1E293B" />
            <circle cx="32" cy="35" r="3" fill="#fcd34d" opacity="0.4" />
            <circle cx="38" cy="50" r="2" fill="#fcd34d" opacity="0.3" />
            <circle cx="32" cy="40" r="2" fill="#b45309" />
            <path d="M28 48 Q32 52,36 48" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function BirdSVG({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 50 50" className={className} aria-hidden>
            <ellipse cx="25" cy="28" rx="14" ry="12" fill="#38bdf8" />
            <ellipse cx="25" cy="32" rx="9" ry="7" fill="#e0f2fe" />
            <circle cx="20" cy="24" r="4" fill="white" />
            <circle cx="30" cy="24" r="4" fill="white" />
            <circle cx="21" cy="24" r="2" fill="#1e293b" />
            <circle cx="31" cy="24" r="2" fill="#1e293b" />
            <polygon points="24,28 26,28 25,31" fill="#f97316" />
            <path d="M12 28 Q8 22,14 24Z" fill="#0ea5e9" />
            <path d="M38 28 Q42 22,36 24Z" fill="#0ea5e9" className="animate-wave-hand" />
        </svg>
    );
}

/* ── Floating Star ─────────────────────────────────────────────────────────── */
function Star({ size, top, left, delay }: { size: number; top: string; left: string; delay: number }) {
    return (
        <div
            className="absolute animate-twinkle pointer-events-none"
            style={{ top, left, animationDelay: `${delay}s`, width: size, height: size }}
        >
            <svg viewBox="0 0 20 20" fill="#fde68a">
                <polygon points="10,0 13,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 7,7" />
            </svg>
        </div>
    );
}

/* ── Sparkle Dot ──────────────────────────────────────────────────────────── */
function Sparkle({ top, left, delay, color = '#fde68a' }: { top: string; left: string; delay: number; color?: string }) {
    return (
        <div
            className="absolute w-2 h-2 rounded-full animate-pulse-glow pointer-events-none"
            style={{ top, left, animationDelay: `${delay}s`, background: color }}
        />
    );
}

/* ── Floating Arabic letter ───────────────────────────────────────────────── */
function FloatingLetter({ char, top, left, delay, color = '#fef3c7' }: {
    char: string; top: string; left: string; delay: number; color?: string;
}) {
    return (
        <div
            className="absolute font-arabic text-2xl lg:text-3xl font-bold pointer-events-none animate-float-letter select-none"
            style={{ top, left, animationDelay: `${delay}s`, color, opacity: 0.7, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
            {char}
        </div>
    );
}

/* ── Floating Hijaiyah Bubble ─────────────────────────────────────────────── */
function HijaiyahBubble({ char, delay, duration, startX }: {
    char: string; delay: number; duration: number; startX: string;
}) {
    return (
        <div
            className="absolute bottom-0 pointer-events-none animate-bubble-rise"
            style={{
                left: startX,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="font-arabic text-lg lg:text-xl text-amber-200 font-bold">{char}</span>
            </div>
        </div>
    );
}

/* ── Tap Sparkle Effect ───────────────────────────────────────────────────── */
function TapSparkle({ sparkle }: { sparkle: SparkleData }) {
    return (
        <motion.div
            className="absolute pointer-events-none z-20"
            style={{ left: sparkle.x - sparkle.size / 2, top: sparkle.y - sparkle.size / 2 }}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: [0, 1.8, 0], opacity: [1, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <span style={{ fontSize: sparkle.size, color: sparkle.color }}>{sparkle.emoji}</span>
        </motion.div>
    );
}

/* ── Tapped Letter Pop ────────────────────────────────────────────────────── */
function TappedLetterPop({ data }: { data: TappedLetter }) {
    return (
        <motion.div
            className="absolute pointer-events-none z-20 font-arabic font-bold"
            style={{ left: data.x - 16, top: data.y - 16, color: data.color, textShadow: `0 0 20px ${data.color}` }}
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: [0, 2, 1.5], opacity: [1, 1, 0], y: [0, -60] }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <span style={{ fontSize: '2rem' }}>{data.char}</span>
        </motion.div>
    );
}

/* ── Confetti Particle ────────────────────────────────────────────────────── */
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
    return (
        <motion.div
            className="absolute pointer-events-none z-30"
            style={{ left: x, top: '50%' }}
            initial={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
                y: [0, -80 - Math.random() * 60],
                x: [(Math.random() - 0.5) * 100],
                opacity: [1, 0],
                scale: [1, 0.5],
                rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        >
            <div
                className="w-2 h-2 rounded-sm"
                style={{ background: color }}
            />
        </motion.div>
    );
}

/* ── Orbiting Hijaiyah Ring ───────────────────────────────────────────────── */
function OrbitRing() {
    const chars = useMemo(() => ['ا','ب','ت','ث','ج','ح'], []);
    return (
        <div className="hero-orbit-ring hidden lg:block">
            {chars.map((ch, i) => {
                const angle = (360 / chars.length) * i;
                return (
                    <motion.div
                        key={ch}
                        className="hero-orbit-item"
                        style={{ '--orbit-angle': `${angle}deg` } as React.CSSProperties}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                        <div className="hero-orbit-letter">
                            <span className="font-arabic text-lg font-bold text-amber-200">{ch}</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ── Interactive Tappable Hijaiyah Letter ─────────────────────────────────── */
function InteractiveHijaiyahLetter({ char, style, delay, onTap }: {
    char: string;
    style: React.CSSProperties;
    delay: number;
    onTap: (x: number, y: number, char: string) => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    return (
        <motion.button
            ref={ref}
            className="hero-interactive-letter"
            style={{ ...style, animationDelay: `${delay}s` }}
            whileHover={{ scale: 1.4, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
                e.stopPropagation();
                const rect = ref.current?.getBoundingClientRect();
                if (rect) {
                    onTap(rect.left + rect.width / 2, rect.top + rect.height / 2, char);
                }
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -15, 0], rotate: [-5, 5, -5] }}
            transition={{
                opacity: { delay: delay * 0.3 + 0.5, duration: 0.5 },
                scale: { delay: delay * 0.3 + 0.5, type: 'spring', damping: 12 },
                y: { duration: 3 + delay % 2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4 + delay % 3, repeat: Infinity, ease: 'easeInOut' }
            }}
        >
            {char}
        </motion.button>
    );
}

/* ── Feature Card (bottom) ────────────────────────────────────────────────── */
function FeatureCard({ emoji, label, sub, gradient, glow, delay }: {
    emoji: string; label: string; sub: string; gradient: string; glow: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, type: 'spring', damping: 18 }}
            whileHover={{ scale: 1.1, y: -6 }}
            whileTap={{ scale: 0.92 }}
            className="hero-feature-card"
            style={{ '--feature-glow': glow } as React.CSSProperties}
        >
            <div className={`hero-feature-icon bg-gradient-to-br ${gradient}`}>
                <span className="text-xl lg:text-2xl">{emoji}</span>
            </div>
            <div className="leading-tight">
                <span className="block font-extrabold text-[11px] lg:text-xs text-white">{label}</span>
                <span className="block text-[9px] lg:text-[10px] text-white/50 font-bold">{sub}</span>
            </div>
        </motion.div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  MAIN HOME PAGE                                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── Sound Control Component ─────────────────────────────────────────────── */
function SoundControl() {
    const { isMuted, isPlaying, volume, toggle, setVolume } = useBGM();
    const [showSlider, setShowSlider] = useState(false);

    return (
        <div 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all border border-white/10 relative"
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
            onTouchStart={() => setShowSlider(!showSlider)}
        >
            <motion.button
                whileTap={{ scale: 0.9 }}
                className={`relative p-3 rounded-full transition-all ${
                    isMuted ? 'text-white/50' : 'text-white'
                }`}
                onClick={(e) => { e.stopPropagation(); toggle(); }}
            >
                {/* Pulsing ring when playing */}
                {isPlaying && (
                    <motion.span 
                        className="absolute inset-0 rounded-full border-2 border-indigo-400/60 pointer-events-none"
                        animate={{ scale: [1, 1.4, 1.4], opacity: [0.7, 0, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
                <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
            </motion.button>

            <AnimatePresence>
                {showSlider && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 100, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden pr-4 flex items-center"
                    >
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => {
                                if (isMuted && parseFloat(e.target.value) > 0) toggle();
                                setVolume(parseFloat(e.target.value));
                            }}
                            className="w-24 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer outline-none accent-indigo-400"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Track if splash screen was seen during this session to avoid showing it again when navigating back
let hasSeenSplash = false;

export default function Home({ auth }: Props) {
    const [showShootingStar, setShowShootingStar] = useState(false);
    const [sparkles, setSparkles] = useState<SparkleData[]>([]);
    const [tappedLetters, setTappedLetters] = useState<TappedLetter[]>([]);
    const [mascotMsg, setMascotMsg] = useState('Yuk, mulai petualangan belajar kita! 🎉');
    const [mascotPose, setMascotPose] = useState<'happy' | 'wave' | 'winking'>('wave');
    const [showConfetti, setShowConfetti] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [isStarted, setIsStarted] = useState(hasSeenSplash);
    const sparkleIdRef = useRef(0);
    const letterIdRef = useRef(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // Fullscreen handlers
    const startFullscreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
            if (window.screen && screen.orientation && (screen.orientation as any).lock) {
                (screen.orientation as any).lock('landscape').catch(() => {});
            }
        } catch (err) {
            console.warn("Fullscreen request failed", err);
        }
        hasSeenSplash = true;
        setIsStarted(true);
        sessionStorage.setItem('gameStarted', 'true');
    };

    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
            if (window.screen && screen.orientation && (screen.orientation as any).unlock) {
                (screen.orientation as any).unlock();
            }
        } catch (err) {
            console.warn("Exit fullscreen failed", err);
        }
        setIsStarted(false);
        sessionStorage.removeItem('gameStarted');
    };

    // Shooting star interval
    useEffect(() => {
        const interval = setInterval(() => {
            setShowShootingStar(true);
            setTimeout(() => setShowShootingStar(false), 1800);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Tap to sparkle handler
    const handleTapSparkle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;

        let clientX: number, clientY: number;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        const emoji = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
        const size = 18 + Math.random() * 22;
        const id = sparkleIdRef.current++;

        setSparkles(prev => [...prev.slice(-12), { id, x, y, color, size, emoji }]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => s.id !== id));
        }, 900);
    }, []);

    // Interactive letter tap handler
    const handleLetterTap = useCallback((x: number, y: number, char: string) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        const id = letterIdRef.current++;
        const relX = x - rect.left;
        const relY = y - rect.top;
        setTappedLetters(prev => [...prev.slice(-8), { id, x: relX, y: relY, char, color }]);
        setTapCount(prev => prev + 1);
        setTimeout(() => {
            setTappedLetters(prev => prev.filter(l => l.id !== id));
        }, 1100);
    }, []);

    // Mascot click handler
    const handleMascotClick = useCallback(() => {
        const msg = MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)];
        setMascotMsg(msg);
        setMascotPose(prev => prev === 'wave' ? 'winking' : prev === 'winking' ? 'happy' : 'wave');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
        // Clear message after a while
        setTimeout(() => setMascotMsg(''), 4000);
    }, []);

    // Interactive letter positions (scattered around the hero area)
    const interactiveLetters = useMemo(() => [
        { char: 'ا', style: { top: '12%', left: '8%' }, delay: 0 },
        { char: 'ب', style: { top: '6%', left: '25%' }, delay: 1 },
        { char: 'ت', style: { top: '18%', left: '78%' }, delay: 2 },
        { char: 'ث', style: { top: '30%', left: '90%' }, delay: 3 },
        { char: 'ج', style: { top: '8%', left: '68%' }, delay: 4 },
        { char: 'ح', style: { top: '35%', left: '5%' }, delay: 5 },
        { char: 'خ', style: { top: '25%', left: '50%' }, delay: 6 },
        { char: 'د', style: { top: '5%', left: '45%' }, delay: 7 },
    ], []);

    return (
        <div
            ref={heroRef}
            className="home-hero"
            onClick={handleTapSparkle}
        >
            <Head title="Pintar Hijaiyah — Belajar Hijaiyah Jadi Seru!" />

            {/* ━━━ SPLASH SCREEN OVERLAY ━━━ */}
            <AnimatePresence>
                {!isStarted && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 cursor-default overflow-hidden"
                    >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md"></div>
                        
                        {/* Rotating light rays */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] opacity-30 pointer-events-none"
                            style={{
                                background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 15deg, transparent 30deg, rgba(255,255,255,0.2) 45deg, transparent 60deg, rgba(255,255,255,0.2) 75deg, transparent 90deg, rgba(255,255,255,0.2) 105deg, transparent 120deg, rgba(255,255,255,0.2) 135deg, transparent 150deg, rgba(255,255,255,0.2) 165deg, transparent 180deg, rgba(255,255,255,0.2) 195deg, transparent 210deg, rgba(255,255,255,0.2) 225deg, transparent 240deg, rgba(255,255,255,0.2) 255deg, transparent 270deg, rgba(255,255,255,0.2) 285deg, transparent 300deg, rgba(255,255,255,0.2) 315deg, transparent 330deg, rgba(255,255,255,0.2) 345deg, transparent 360deg)"
                            }}
                        />

                        {/* Content */}
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", damping: 12 }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <MascotHufi pose="happy" className="w-48 h-48 sm:w-64 sm:h-64 mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
                            </motion.div>

                            <h2 
                                className="text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-500 text-center leading-tight tracking-widest drop-shadow-[0_4px_0_rgba(0,0,0,0.8)]" 
                                style={{ fontFamily: "'Lilita One', cursive", WebkitTextStroke: "2px #78350f" }}
                            >
                                PINTAR HIJAIYAH
                            </h2>
                            <p className="mb-10 text-center text-lg md:text-2xl max-w-md font-bold text-white drop-shadow-md">
                                Siap untuk mulai petualangan?
                            </p>

                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
                                onClick={(e) => { e.stopPropagation(); startFullscreen(); }} 
                                className="relative overflow-hidden btn-3d bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_8px_0_#14532d,0_15px_30px_rgba(0,0,0,0.5)] text-3xl md:text-4xl rounded-full px-12 py-5 flex items-center gap-4 font-black border-4 border-white"
                                style={{ fontFamily: "'Lilita One', cursive" }}
                            >
                                <span className="drop-shadow-md">▶</span> Mainkan!
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background elements removed to use landing_page.png */}

            {/* ━━━ TAP SPARKLES ━━━ */}
            <AnimatePresence>
                {sparkles.map(s => <TapSparkle key={s.id} sparkle={s} />)}
            </AnimatePresence>

            {/* ━━━ TAPPED LETTERS ━━━ */}
            <AnimatePresence>
                {tappedLetters.map(l => <TappedLetterPop key={l.id} data={l} />)}
            </AnimatePresence>

            {/* ━━━ INTERACTIVE SCENE LAYER ━━━ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Floating Background Bubbles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <HijaiyahBubble
                        key={i}
                        char={HIJAIYAH_CHARS[i % HIJAIYAH_CHARS.length]}
                        delay={i * 2}
                        duration={15 + Math.random() * 10}
                        startX={`${5 + Math.random() * 90}%`}
                    />
                ))}
                
                {/* Interactive Tappable Letters */}
                <div className="pointer-events-auto">
                    {interactiveLetters.map((l, i) => (
                        <InteractiveHijaiyahLetter
                            key={i}
                            char={l.char}
                            style={l.style}
                            delay={l.delay}
                            onTap={handleLetterTap}
                        />
                    ))}
                </div>
            </div>

            {/* ━━━ VOLUME BUTTON + TAP COUNTER ━━━ */}
            <div className="relative z-10 flex justify-between items-center px-5 pt-5">
                {/* Tap counter badge */}
                <AnimatePresence>
                    {tapCount > 0 && (
                        <motion.div
                            key={tapCount}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="hero-tap-counter"
                        >
                            <span className="text-xs">⭐</span>
                            <span className="text-[11px] font-black text-amber-300">{tapCount}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="flex items-center gap-3 ml-auto pointer-events-auto">
                    <Link
                        href={auth.user ? '/parent/dashboard' : '/login'}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-xl">👥</span>
                    </Link>
                    <SoundControl />
                    {isStarted && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white/10 hover:bg-red-500/80 backdrop-blur-sm px-4 py-2 rounded-full transition-all border border-white/10 font-bold text-white flex items-center gap-2"
                            onClick={(e) => { e.stopPropagation(); exitFullscreen(); }}
                        >
                            <span className="text-sm">✖</span> <span className="hidden sm:inline">Keluar</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* ━━━ MAIN CONTENT — Centered layout ━━━ */}
            <div className="relative z-10 flex-1 flex flex-col landscape:flex-row items-center justify-center landscape:justify-evenly px-5 pt-0 pb-2 w-full max-w-6xl mx-auto gap-2 landscape:gap-8">
                
                {/* ── LEFT COLUMN (Landscape) / TOP COLUMN (Portrait) ── */}
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                        className="title-wrapper relative z-20 mt-1 lg:mt-2 landscape:scale-75 landscape:origin-bottom lg:landscape:scale-100 lg:landscape:origin-center"
                    >
                        <div className="relative">
                            <h1 className="title-pintar">Pintar</h1>
                            <div className="absolute -top-8 -right-12 sm:-top-12 sm:-right-20 text-5xl sm:text-[5rem] transform rotate-12 drop-shadow-xl z-10">
                                📖
                                <span className="absolute -top-4 -left-2 text-xl sm:text-3xl font-arabic text-amber-900 rotate-[-15deg]">ا</span>
                                <span className="absolute -top-6 left-6 text-xl sm:text-3xl font-arabic text-amber-900">ب</span>
                                <span className="absolute -top-2 left-12 text-xl sm:text-3xl font-arabic text-amber-900 rotate-[10deg]">ت</span>
                            </div>
                        </div>
                        <h2 className="title-hijaiyah">Hijaiyah</h2>
                    </motion.div>

                    {/* Subtitle Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', damping: 18 }}
                        className="relative mt-2 mb-2 lg:mb-6 z-20 landscape:hidden lg:landscape:block pointer-events-auto"
                    >
                        <div className="subtitle-banner text-center flex items-center justify-center gap-2">
                            <span className="hero-shimmer-text">
                                Belajar Hijaiyah Jadi Seru!
                            </span>
                        </div>
                    </motion.div>

                    {/* Mascot */}
                    <div className="relative flex flex-col items-center group cursor-pointer lg:landscape:mt-0 pointer-events-auto" onClick={(e) => { e.stopPropagation(); handleMascotClick(); }}>
                        
                        {/* Mascot Speech Bubble */}
                        <AnimatePresence>
                            {mascotMsg && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#78350f] font-bold px-4 py-2 rounded-2xl shadow-xl z-30 border-2 border-amber-200"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {mascotMsg}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-amber-200 transform rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative z-10"
                        >
                            <MascotHufi pose={mascotPose} className="w-40 h-40 sm:w-56 sm:h-56 landscape:w-32 landscape:h-32 lg:landscape:w-56 lg:landscape:h-56 drop-shadow-2xl" />
                        </motion.div>

                        <AnimatePresence>
                            {showConfetti && (
                                <div className="absolute inset-0 pointer-events-none z-20">
                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <ConfettiParticle
                                            key={i}
                                            delay={i * 0.02}
                                            x={Math.random() * 200 - 20}
                                            color={SPARKLE_COLORS[i % SPARKLE_COLORS.length]}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (Landscape) / BOTTOM COLUMN (Portrait) ── */}
                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-[320px] px-2 justify-center landscape:scale-90 lg:landscape:scale-100 z-30 pointer-events-auto">
                    <Link
                        href="/learn"
                        id="btn-mulai-belajar"
                        className="cta-play-massive group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-white text-2xl sm:text-3xl drop-shadow-md">▶</span>
                        <span className="flex-1 text-center font-bold tracking-wide text-base sm:text-xl whitespace-nowrap">Mulai Belajar</span>
                    </Link>

                    <Link
                        href="/game/select"
                        id="btn-masuk-game"
                        className="cta-parent-massive group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-white text-2xl sm:text-3xl drop-shadow-md">🎮</span>
                        <span className="flex-1 text-center font-bold tracking-wide text-sm sm:text-lg whitespace-nowrap">Masuk Game</span>
                    </Link>
                </div>
            </div>

            {/* ━━━ OVERLAY TEXT FOR PAINTED WOODEN BOARD ━━━ */}
            {/* The painted board is part of the background image, left intentionally blank as requested. */}

            {/* Bird removed */}

            {/* ━━━ BOTTOM FEATURE CARDS ━━━ */}
            <div className="relative z-10 px-4 mt-auto mb-28 md:mb-8 w-full flex justify-center landscape:hidden lg:landscape:flex">
                <div className="bg-[#fefce8] rounded-[30px] px-4 py-2 sm:px-6 sm:py-3 flex gap-3 sm:gap-6 lg:gap-8 flex-wrap justify-center shadow-[0_6px_15px_rgba(0,0,0,0.2)] border-[3px] border-white scale-90 sm:scale-100 origin-bottom">
                    {/* Item 1 */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-inner border border-white">⭐</div>
                        <div className="leading-tight flex flex-col justify-center">
                            <span className="font-bold text-[9px] sm:text-[10px] text-blue-800 uppercase tracking-wide">Belajar</span>
                            <span className="font-black text-[11px] sm:text-xs text-blue-600">Menyenangkan</span>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-inner border border-white">🏆</div>
                        <div className="leading-tight flex flex-col justify-center">
                            <span className="font-bold text-[9px] sm:text-[10px] text-green-800 uppercase tracking-wide">Raih</span>
                            <span className="font-black text-[11px] sm:text-xs text-green-600">Bintang</span>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-inner border border-white">🎁</div>
                        <div className="leading-tight flex flex-col justify-center">
                            <span className="font-bold text-[9px] sm:text-[10px] text-pink-800 uppercase tracking-wide">Dapatkan</span>
                            <span className="font-black text-[11px] sm:text-xs text-pink-600">Hadiah</span>
                        </div>
                    </div>
                    {/* Item 4 */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-inner border border-white">🛡️</div>
                        <div className="leading-tight flex flex-col justify-center">
                            <span className="font-bold text-[9px] sm:text-[10px] text-purple-800 uppercase tracking-wide">Jadi Juara</span>
                            <span className="font-black text-[11px] sm:text-xs text-purple-600">Hijaiyah</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ━━━ MOBILE NAV ━━━ */}
            <MobileNav />
        </div>
    );
}
