import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ChevronDown, ChevronUp, BookOpen, Sparkles, ArrowLeft, Gamepad2, Star, Volume2, CheckCircle2, Trophy, Lightbulb, Eye, EyeOff, Zap, Heart } from 'lucide-react';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';

/* ─── Tajwid Data ──────────────────────────────────────────────────────────── */

interface TajwidRule {
    id: string;
    title: string;
    titleAr?: string;
    emoji: string;
    color: string;
    colorLight: string;
    borderColor: string;
    iconBg: string;
    gradientFrom: string;
    gradientTo: string;
    description: string;
    letters?: string;
    lettersLabel?: string;
    example?: { arabic: string; latin: string; meaning?: string };
    tip?: string;
}

interface TajwidCategory {
    id: string;
    title: string;
    emoji: string;
    subtitle: string;
    gradient: string;
    gradientLight: string;
    borderColor: string;
    accentColor: string;
    rules: TajwidRule[];
}

const TAJWID_DATA: TajwidCategory[] = [
    {
        id: 'nun-mati',
        title: 'Hukum Nun Mati & Tanwin',
        emoji: '🌙',
        subtitle: 'نْ — Nun Sukun & Tanwin',
        gradient: 'from-blue-500 to-indigo-600',
        gradientLight: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200',
        accentColor: '#6366f1',
        rules: [
            {
                id: 'izhar',
                title: 'Izhar Halqi',
                titleAr: 'إظهار',
                emoji: '💎',
                color: 'text-sky-700',
                colorLight: 'bg-sky-50',
                borderColor: 'border-sky-200',
                iconBg: 'bg-sky-500',
                gradientFrom: '#0ea5e9',
                gradientTo: '#0284c7',
                description: 'Dibaca JELAS dan TERANG tanpa mendengung. Artinya huruf Nun Mati/Tanwin harus terdengar jelas.',
                letters: 'ء ه ع ح غ خ',
                lettersLabel: 'Huruf Halqi (Tenggorokan)',
                example: { arabic: 'مَنْ أَعْطَى', latin: "Man 'a'tho", meaning: 'Barangsiapa yang memberi' },
                tip: 'Ingat: Hurufnya dari TENGGOROKAN, jadi Nun dibaca jelas!',
            },
            {
                id: 'idgham-bighunnah',
                title: 'Idgham Bighunnah',
                titleAr: 'إدغام بغنة',
                emoji: '🎵',
                color: 'text-violet-700',
                colorLight: 'bg-violet-50',
                borderColor: 'border-violet-200',
                iconBg: 'bg-violet-500',
                gradientFrom: '#8b5cf6',
                gradientTo: '#7c3aed',
                description: 'Dimasukkan dengan DENGUNG (suara dari hidung). Nun Mati "lebur" ke huruf berikutnya sambil berdengung.',
                letters: 'ي ن م و',
                lettersLabel: 'Huruf YANMU (يَنْمُو)',
                example: { arabic: 'مَنْ يَعْمَلْ', latin: "May ya'mal", meaning: 'Barangsiapa yang mengerjakan' },
                tip: 'Cara hafal mudah: YANMU → Ya, Nun, Mim, Wawu!',
            },
            {
                id: 'idgham-bilaghunnah',
                title: 'Idgham Bilaghunnah',
                titleAr: 'إدغام بلاغنة',
                emoji: '🔔',
                color: 'text-amber-700',
                colorLight: 'bg-amber-50',
                borderColor: 'border-amber-200',
                iconBg: 'bg-amber-500',
                gradientFrom: '#f59e0b',
                gradientTo: '#d97706',
                description: 'Dimasukkan TANPA dengung. Nun Mati langsung lebur ke huruf Lam atau Ra tanpa suara hidung.',
                letters: 'ل ر',
                lettersLabel: 'Hanya 2 huruf',
                example: { arabic: 'مِنْ رَبِّهِمْ', latin: 'Mir rabbihim', meaning: 'Dari Tuhan mereka' },
                tip: 'Hanya Lam (ل) dan Ra (ر) — langsung masuk tanpa nge-dung!',
            },
            {
                id: 'iqlab',
                title: 'Iqlab',
                titleAr: 'إقلاب',
                emoji: '🔄',
                color: 'text-emerald-700',
                colorLight: 'bg-emerald-50',
                borderColor: 'border-emerald-200',
                iconBg: 'bg-emerald-500',
                gradientFrom: '#10b981',
                gradientTo: '#059669',
                description: 'Mengubah bunyi Nun Mati/Tanwin menjadi bunyi MIM (م) dengan dengung. Bibir harus menutup.',
                letters: 'ب',
                lettersLabel: 'Hanya 1 huruf: Ba',
                example: { arabic: 'أَنْبِئْهُمْ', latin: "Ambi'hum", meaning: 'Beritahukanlah kepada mereka' },
                tip: 'Ketemu Ba (ب), ubah Nun jadi Mim! Tutup bibir ya! 👄',
            },
            {
                id: 'ikhfa',
                title: 'Ikhfa Haqiqi',
                titleAr: 'إخفاء حقيقي',
                emoji: '🌊',
                color: 'text-cyan-700',
                colorLight: 'bg-cyan-50',
                borderColor: 'border-cyan-200',
                iconBg: 'bg-cyan-500',
                gradientFrom: '#06b6d4',
                gradientTo: '#0891b2',
                description: 'Dibaca SAMAR-SAMAR, antara jelas dan dengung. Bunyi Nun Mati dibaca halus, tidak jelas dan tidak mendengung penuh.',
                letters: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
                lettersLabel: '15 huruf sisanya',
                example: { arabic: 'مِنْ قَبْلُ', latin: 'Min qoblu', meaning: 'Dari sebelumnya' },
                tip: 'Semua huruf yang BUKAN Izhar, Idgham, dan Iqlab!',
            },
        ],
    },
    {
        id: 'mim-mati',
        title: 'Hukum Mim Mati',
        emoji: '⭐',
        subtitle: 'مْ — Mim Sukun',
        gradient: 'from-pink-500 to-rose-600',
        gradientLight: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-200',
        accentColor: '#ec4899',
        rules: [
            {
                id: 'ikhfa-syafawi',
                title: 'Ikhfa Syafawi',
                titleAr: 'إخفاء شفوي',
                emoji: '👄',
                color: 'text-pink-700',
                colorLight: 'bg-pink-50',
                borderColor: 'border-pink-200',
                iconBg: 'bg-pink-500',
                gradientFrom: '#ec4899',
                gradientTo: '#db2777',
                description: 'Dibaca samar di BIBIR dengan sedikit dengung. Mim Mati bertemu huruf Ba, bunyinya samar.',
                letters: 'ب',
                lettersLabel: 'Hanya 1 huruf: Ba',
                example: { arabic: 'تَرْمِيْهِمْ بِحِجَارَةٍ', latin: 'Tarmiihim bihijaarotin', meaning: 'Melempari mereka dengan batu' },
                tip: 'Mim ketemu Ba = samar di bibir! Dengungnya pelan ya 🤫',
            },
            {
                id: 'idgham-mimi',
                title: 'Idgham Mimi',
                titleAr: 'إدغام ميمي',
                emoji: '🤝',
                color: 'text-fuchsia-700',
                colorLight: 'bg-fuchsia-50',
                borderColor: 'border-fuchsia-200',
                iconBg: 'bg-fuchsia-500',
                gradientFrom: '#d946ef',
                gradientTo: '#c026d3',
                description: 'Mim bertemu Mim — dilebur jadi SATU Mim panjang dengan dengung. Dua Mim bergabung!',
                letters: 'م',
                lettersLabel: 'Hanya 1 huruf: Mim',
                example: { arabic: 'لَهُمْ مَا يَشَاؤُنَ', latin: 'Lahum maa yasyaa-uun', meaning: 'Bagi mereka apa yang mereka kehendaki' },
                tip: 'Mim + Mim = Mim panjang! Seperti teman kembar! 👯',
            },
            {
                id: 'izhar-syafawi',
                title: 'Izhar Syafawi',
                titleAr: 'إظهار شفوي',
                emoji: '🔊',
                color: 'text-orange-700',
                colorLight: 'bg-orange-50',
                borderColor: 'border-orange-200',
                iconBg: 'bg-orange-500',
                gradientFrom: '#f97316',
                gradientTo: '#ea580c',
                description: 'Dibaca JELAS di bibir tanpa dengung. Mim Mati dibaca terang dan jelas saat bertemu huruf selain Ba dan Mim.',
                letters: 'ء ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل ن و ه ي',
                lettersLabel: 'Semua huruf selain ب dan م (26 Huruf)',
                example: { arabic: 'أَمْ لَمْ', latin: "Am lam", meaning: 'Ataukah tidak' },
                tip: 'Bukan Ba, bukan Mim = baca Mim-nya JELAS! 📢',
            },
        ],
    },
    {
        id: 'qalqalah',
        title: 'Qalqalah (Pantulan)',
        emoji: '🏀',
        subtitle: 'قلقلة — Memantul',
        gradient: 'from-amber-500 to-orange-600',
        gradientLight: 'from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
        accentColor: '#f59e0b',
        rules: [
            {
                id: 'qalqalah-sughra',
                title: 'Qalqalah Sughra',
                titleAr: 'قلقلة صغرى',
                emoji: '🔸',
                color: 'text-amber-700',
                colorLight: 'bg-amber-50',
                borderColor: 'border-amber-200',
                iconBg: 'bg-amber-500',
                gradientFrom: '#f59e0b',
                gradientTo: '#d97706',
                description: 'Pantulan KECIL — terjadi saat huruf Qalqalah berharakat sukun (mati) di TENGAH kata. Pantulannya ringan.',
                letters: 'ب ج د ط ق',
                lettersLabel: 'Huruf Qalqalah: BA-JU-DI-TO-QO',
                example: { arabic: 'يَجْعَلُونَ', latin: 'Yaj\'aluun', meaning: 'Mereka menjadikan' },
                tip: 'Sukun di TENGAH kata = pantul kecil! Seperti bola kecil 🏓',
            },
            {
                id: 'qalqalah-kubra',
                title: 'Qalqalah Kubra',
                titleAr: 'قلقلة كبرى',
                emoji: '🔶',
                color: 'text-orange-700',
                colorLight: 'bg-orange-50',
                borderColor: 'border-orange-200',
                iconBg: 'bg-orange-500',
                gradientFrom: '#f97316',
                gradientTo: '#ea580c',
                description: 'Pantulan BESAR — terjadi saat huruf Qalqalah berada di AKHIR kata (saat berhenti/waqof). Pantulannya kuat dan jelas.',
                letters: 'ب ج د ط ق',
                lettersLabel: 'Huruf Qalqalah: BA-JU-DI-TO-QO',
                example: { arabic: 'وَالْفَلَقِ', latin: 'Wal falaq', meaning: 'Dan waktu subuh' },
                tip: 'Di AKHIR kata = pantul besar! Seperti bola basket! 🏀',
            },
        ],
    },
];

/* ─── Animated Floating Particles ──────────────────────────────────────────── */

function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/20"
                    style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                    }}
                />
            ))}
        </div>
    );
}

/* ─── Category Tab Pills ───────────────────────────────────────────────────── */

function CategoryTabs({ categories, activeIdx, onChange }: { categories: TajwidCategory[]; activeIdx: number; onChange: (i: number) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const activeEl = scrollRef.current.children[activeIdx] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [activeIdx]);

    return (
        <div ref={scrollRef} className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory -mx-1">
            {categories.map((cat, idx) => (
                <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(idx)}
                    className={`snap-center flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-black text-sm sm:text-base whitespace-nowrap transition-all duration-300 shrink-0 border-2 ${
                        activeIdx === idx
                            ? `bg-gradient-to-r ${cat.gradient} text-white border-white/30 shadow-lg shadow-indigo-500/20 scale-[1.02]`
                            : 'bg-white/80 backdrop-blur-sm text-slate-600 border-slate-200/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                    }`}
                >
                    <span className="text-xl sm:text-2xl">{cat.emoji}</span>
                    <span className="hidden sm:inline">{cat.title.split(' ').slice(1).join(' ')}</span>
                    <span className="sm:hidden">{cat.id === 'nun-mati' ? 'Nun Mati' : cat.id === 'mim-mati' ? 'Mim Mati' : 'Qalqalah'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-black ${
                        activeIdx === idx ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                        {cat.rules.length}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}

/* ─── Interactive Rule Card (Full-Featured) ────────────────────────────────── */

function RuleCard({ rule, index, isActive }: { rule: TajwidRule; index: number; isActive: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showLetters, setShowLetters] = useState(true);
    const { playAudio } = useAudioPlayer();

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', damping: 22, stiffness: 200 }}
            layout
        >
            {/* ── Card Header (Clickable) ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left rounded-3xl transition-all duration-300 active:scale-[0.98] overflow-hidden ${
                    isOpen
                        ? 'shadow-xl rounded-b-none'
                        : 'shadow-md hover:shadow-lg hover:-translate-y-0.5'
                }`}
                style={{
                    background: isOpen
                        ? `linear-gradient(135deg, ${rule.gradientFrom}15, ${rule.gradientTo}10)`
                        : 'rgba(255,255,255,0.92)',
                    border: `2.5px solid ${isOpen ? rule.gradientFrom + '40' : '#e2e8f0'}`,
                }}
            >
                <div className="flex items-center gap-4 p-5 sm:p-6">
                    {/* Animated Icon Badge */}
                    <motion.div
                        animate={isOpen ? { rotate: [0, -5, 5, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative shrink-0"
                    >
                        <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-2 border-white/50"
                            style={{ background: `linear-gradient(135deg, ${rule.gradientFrom}, ${rule.gradientTo})` }}
                        >
                            {rule.emoji}
                        </div>
                        {/* Pulse ring when open */}
                        {isOpen && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{ border: `2px solid ${rule.gradientFrom}` }}
                                animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.div>

                    {/* Title Block */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-black text-lg sm:text-xl leading-tight ${isOpen ? rule.color : 'text-slate-800'}`}>
                            {rule.title}
                        </h3>
                        {rule.titleAr && (
                            <p className={`text-sm sm:text-base font-bold mt-0.5 ${isOpen ? rule.color + ' opacity-70' : 'text-slate-400'}`} dir="rtl">
                                {rule.titleAr}
                            </p>
                        )}
                    </div>

                    {/* Toggle Chevron */}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
                        style={{
                            background: isOpen ? `linear-gradient(135deg, ${rule.gradientFrom}, ${rule.gradientTo})` : '#f1f5f9',
                            color: isOpen ? '#fff' : '#94a3b8',
                        }}
                    >
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                </div>
            </button>

            {/* ── Expanded Content ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div
                            className="rounded-b-3xl px-5 sm:px-7 pb-6 sm:pb-8 pt-4 sm:pt-5 space-y-5"
                            style={{
                                background: `linear-gradient(180deg, ${rule.gradientFrom}08, ${rule.gradientTo}04)`,
                                borderLeft: `2.5px solid ${rule.gradientFrom}40`,
                                borderRight: `2.5px solid ${rule.gradientFrom}40`,
                                borderBottom: `2.5px solid ${rule.gradientFrom}40`,
                            }}
                        >
                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white shadow-sm"
                            >
                                <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed">
                                    {rule.description}
                                </p>
                            </motion.div>

                            {/* Letters Section */}
                            {rule.letters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest">
                                            {rule.lettersLabel}
                                        </p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowLetters(!showLetters); }}
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100"
                                        >
                                            {showLetters ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            {showLetters ? 'Tampil' : 'Sembunyikan'}
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {showLetters && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex flex-wrap gap-2.5 sm:gap-3 justify-center" dir="rtl"
                                            >
                                                {rule.letters.split(' ').map((letter, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.06, type: 'spring', damping: 12 }}
                                                        whileHover={{ scale: 1.15, y: -4 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const cleanLetter = letter.trim();
                                                            console.log('Playing audio for:', cleanLetter);
                                                            playAudio(cleanLetter, cleanLetter, 'polos');
                                                        }}
                                                        className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-white font-bold text-xl sm:text-2xl shadow-lg border-2 border-white/40 cursor-pointer"
                                                        style={{ background: `linear-gradient(135deg, ${rule.gradientFrom}, ${rule.gradientTo})` }}
                                                    >
                                                        {letter}
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Example */}
                            {rule.example && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="rounded-2xl p-5 sm:p-7 border-2 border-white/60 shadow-sm relative overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${rule.gradientFrom}10, ${rule.gradientTo}05)` }}
                                >
                                    {/* Decorative circles */}
                                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10"
                                        style={{ background: rule.gradientFrom }} />
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10"
                                        style={{ background: rule.gradientTo }} />

                                    <p className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-4 relative z-10 flex items-center gap-2">
                                        <span className="text-lg">✏️</span> Contoh
                                    </p>
                                    <div className="text-center space-y-3 relative z-10">
                                        <motion.p
                                            animate={{ scale: [1, 1.01, 1] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            className="font-sans font-black text-4xl sm:text-5xl text-indigo-900 leading-snug py-2" dir="rtl"
                                        >
                                            {rule.example.arabic}
                                        </motion.p>
                                        <p className={`text-base sm:text-lg font-bold ${rule.color}`}>
                                            "{rule.example.latin}"
                                        </p>
                                        {rule.example.meaning && (
                                            <p className="text-sm sm:text-base text-slate-400 font-semibold italic">
                                                {rule.example.meaning}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Tip */}
                            {rule.tip && (
                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25, type: 'spring' }}
                                    className="flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 shadow-sm"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 shrink-0" />
                                    </motion.div>
                                    <p className="text-sm sm:text-base font-bold text-amber-800 leading-relaxed">
                                        {rule.tip}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Progress Ring ────────────────────────────────────────────────────────── */

function MiniProgressRing({ current, total, color }: { current: number; total: number; color: string }) {
    const pct = (current / total) * 100;
    const r = 18;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <motion.circle
                    cx="22" cy="22" r={r} fill="none"
                    stroke={color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            <span className="absolute text-xs sm:text-sm font-black text-slate-700">{current}</span>
        </div>
    );
}

/* ─── Category Progress Card ──────────────────────────────────────────────── */

function ProgressCard({ categories, activeIdx }: { categories: TajwidCategory[]; activeIdx: number }) {
    const totalRules = categories.reduce((sum, c) => sum + c.rules.length, 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-indigo-100/60 p-5 sm:p-6 shadow-lg"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="font-black text-base sm:text-lg text-indigo-900 block leading-tight">Ringkasan</span>
                        <span className="text-xs sm:text-sm font-bold text-indigo-400">{totalRules} hukum tajwid</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {}} // Handled by parent
                        className={`rounded-2xl p-3 sm:p-4 text-center border-2 transition-all duration-300 ${
                            activeIdx === idx
                                ? `bg-gradient-to-br ${cat.gradientLight} ${cat.borderColor} shadow-md scale-[1.02]`
                                : 'bg-slate-50/80 border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        <MiniProgressRing current={cat.rules.length} total={totalRules} color={cat.accentColor} />
                        <span className={`text-xs sm:text-sm font-black block mt-2 leading-tight ${
                            activeIdx === idx ? 'text-slate-700' : 'text-slate-500'
                        }`}>
                            {cat.id === 'nun-mati' ? 'Nun Mati' : cat.id === 'mim-mati' ? 'Mim Mati' : 'Qalqalah'}
                        </span>
                        <span className={`text-[10px] sm:text-xs font-bold ${activeIdx === idx ? 'text-slate-500' : 'text-slate-400'}`}>
                            {cat.rules.length} hukum
                        </span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

/* ━━━ MAIN PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LearnTajwid() {
    const [activeCategory, setActiveCategory] = useState(0);
    const category = TAJWID_DATA[activeCategory];

    return (
        <AppLayout title="Belajar Tajwid Dasar" fantasyBg>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full justify-center relative max-w-5xl mx-auto">

                {/* ── Sidebar (Desktop) ── */}
                <div className="hidden lg:flex flex-col items-center w-[300px] shrink-0 sticky top-28 pt-4 z-10 gap-5">
                    {/* Mascot */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                        <img
                            src="/images/maskod/sprite_05.png"
                            alt="Maskot Hufi"
                            className="w-48 h-48 object-contain drop-shadow-2xl relative z-10"
                        />
                    </motion.div>

                    {/* Mascot Speech */}
                    <div className="bg-[#1c1c3f]/80 backdrop-blur-xl rounded-3xl border border-white/10 text-white p-6 w-full shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 opacity-50" />
                        <div className="flex items-center gap-2.5 mb-3 relative z-10">
                            <span className="text-xl">🌙</span>
                            <span className="font-black text-base text-purple-300">Tips dari Hufi!</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-semibold relative z-10">
                            Tajwid artinya membaca Al-Qur'an dengan benar sesuai aturan. Yuk pelajari satu-satu, nanti kamu jadi pintar membaca Al-Qur'an! 📖
                        </p>
                    </div>

                    {/* Progress Card */}
                    <ProgressCard categories={TAJWID_DATA} activeIdx={activeCategory} />

                    {/* Quiz CTA */}
                    <Link
                        href="/game/select"
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 border-2 border-white/20"
                    >
                        <Gamepad2 className="w-5 h-5" /> Coba Quiz Tajwid!
                    </Link>
                </div>

                {/* ── Main Content ── */}
                <div className="flex-1 w-full relative">

                    {/* Hero Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 md:p-8 mb-6 border-2 border-white/20 shadow-2xl relative overflow-hidden"
                    >
                        <FloatingParticles />

                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

                        <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-16 h-16 sm:w-18 sm:h-18 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner border-2 border-white/30 shrink-0"
                            >
                                📖
                            </motion.div>
                            <div className="flex-1">
                                <h1 className="font-black text-white text-2xl sm:text-3xl leading-tight drop-shadow-sm flex items-center gap-2.5">
                                    Belajar Tajwid
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
                                    </motion.div>
                                </h1>
                                <p className="text-sm sm:text-base text-white/70 font-bold mt-1.5">
                                    Ayo pelajari cara membaca Al-Qur'an yang benar! 🌟
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap items-center gap-2.5 mt-5 relative z-10">
                            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                                <span className="text-xs sm:text-sm font-bold text-white">3 Kategori</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                <span className="text-xs sm:text-sm font-bold text-white">10 Hukum</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                <span className="text-xs sm:text-sm font-bold text-white">Interaktif</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Mascot & Info */}
                    <div className="flex lg:hidden flex-col gap-4 mb-6">
                        <div className="bg-[#1c1c3f]/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
                            <motion.img
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-18 h-18 object-contain shrink-0 drop-shadow-lg"
                                style={{ width: '72px', height: '72px' }}
                            />
                            <div>
                                <h3 className="font-black text-sm sm:text-base text-purple-300 flex items-center gap-2 mb-1.5">🌙 Tips dari Hufi!</h3>
                                <p className="text-xs sm:text-sm text-white/80 font-semibold leading-relaxed">
                                    Tajwid artinya membaca Al-Qur'an dengan benar. Yuk pelajari satu-satu! 📖
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What is Tajwid - Intro Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-purple-100/60 p-6 sm:p-7 shadow-lg mb-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0 border-2 border-white">
                                🤔
                            </div>
                            <div>
                                <h2 className="font-black text-lg sm:text-xl text-indigo-900 mb-2.5">Apa itu Tajwid?</h2>
                                <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                                    <strong className="text-purple-700">Tajwid</strong> adalah ilmu yang mempelajari cara membaca Al-Qur'an dengan <strong className="text-emerald-600">benar dan indah</strong>. 
                                    Dengan tajwid, kita tahu kapan harus membaca jelas, mendengung, samar, atau memantulkan huruf. 
                                    Yuk kenali hukum-hukum tajwid dasar! 🎓
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Category Tab Navigation ── */}
                    <div className="mb-6">
                        <CategoryTabs
                            categories={TAJWID_DATA}
                            activeIdx={activeCategory}
                            onChange={setActiveCategory}
                        />
                    </div>

                    {/* ── Active Category Header ── */}
                    <motion.div
                        key={category.id + '-header'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className={`bg-gradient-to-r ${category.gradient} rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-white/20 mb-5 relative overflow-hidden`}
                    >
                        <FloatingParticles />
                        <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-16 h-16 sm:w-18 sm:h-18 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner border-2 border-white/30 shrink-0"
                            >
                                {category.emoji}
                            </motion.div>
                            <div className="flex-1">
                                <h2 className="font-black text-white text-xl sm:text-2xl leading-tight drop-shadow-sm">
                                    {category.title}
                                </h2>
                                <p className="text-sm sm:text-base text-white/70 font-bold mt-1" dir="rtl">
                                    {category.subtitle}
                                </p>
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 shrink-0">
                                <span className="text-sm sm:text-base font-black text-white">
                                    {category.rules.length} hukum
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Rule Cards ── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 sm:space-y-5"
                        >
                            {category.rules.map((rule, idx) => (
                                <RuleCard
                                    key={rule.id}
                                    rule={rule}
                                    index={idx}
                                    isActive={true}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom CTA - Quiz */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 mb-4"
                    >
                        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-7 sm:p-10 text-center border-2 border-white/20 shadow-2xl relative overflow-hidden">
                            <FloatingParticles />
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="text-6xl sm:text-7xl mb-5 inline-block"
                                >
                                    🏆
                                </motion.div>
                                <h3 className="font-black text-white text-2xl sm:text-3xl mb-3 drop-shadow-sm">
                                    Sudah Paham? Yuk Uji! ✨
                                </h3>
                                <p className="text-base sm:text-lg text-white/70 font-bold mb-7 max-w-md mx-auto">
                                    Coba quiz tajwid untuk menguji pemahamanmu! Raih skor 80 untuk lulus! 🎯
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link
                                        href="/game/select"
                                        className="bg-white text-indigo-700 font-black text-lg sm:text-xl py-4 px-10 sm:px-12 rounded-full shadow-xl flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 border-2 border-indigo-100 w-full sm:w-auto justify-center"
                                    >
                                        <Gamepad2 className="w-6 h-6" /> Mulai Quiz Tajwid
                                    </Link>
                                    <Link
                                        href="/learn"
                                        className="text-white/80 hover:text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-colors py-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Kembali ke Huruf
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Progress Card */}
                    <div className="lg:hidden mb-8">
                        <ProgressCard categories={TAJWID_DATA} activeIdx={activeCategory} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
