import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ChevronDown, ChevronUp, BookOpen, Sparkles, ArrowLeft, Gamepad2, Star, Volume2, CheckCircle2 } from 'lucide-react';

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
                description: 'Dimasukkan dengan DENGUNG (suara dari hidung). Nun Mati "lebur" ke huruf berikutnya sambil berdengung.',
                letters: 'ي ن م و',
                lettersLabel: 'Huruf YANMU (يَنْمُو)',
                example: { arabic: 'مَنْ يَعْمَلْ', latin: 'May ya\'mal', meaning: 'Barangsiapa yang mengerjakan' },
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
                description: 'Dibaca JELAS di bibir tanpa dengung. Mim Mati dibaca terang dan jelas saat bertemu huruf selain Ba dan Mim.',
                letters: '26 huruf lainnya',
                lettersLabel: 'Semua huruf selain ب dan م',
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
                description: 'Pantulan BESAR — terjadi saat huruf Qalqalah berada di AKHIR kata (saat berhenti/waqof). Pantulannya kuat dan jelas.',
                letters: 'ب ج د ط ق',
                lettersLabel: 'Huruf Qalqalah: BA-JU-DI-TO-QO',
                example: { arabic: 'وَالْفَلَقِ', latin: 'Wal falaq', meaning: 'Dan waktu subuh' },
                tip: 'Di AKHIR kata = pantul besar! Seperti bola basket! 🏀',
            },
        ],
    },
];

/* ─── Expandable Rule Card ─────────────────────────────────────────────────── */

function RuleCard({ rule, index }: { rule: TajwidRule; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, type: 'spring', damping: 20 }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left rounded-2xl border-2 ${rule.borderColor} ${rule.colorLight} p-3.5 sm:p-4 transition-all duration-300 active:scale-[0.98] ${isOpen ? 'shadow-lg ring-2 ring-offset-1 ring-opacity-30' : 'shadow-sm hover:shadow-md'}`}
                style={isOpen ? { '--tw-ring-color': rule.iconBg.replace('bg-', '') } as React.CSSProperties : {}}
            >
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${rule.iconBg} rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0 border-2 border-white`}>
                        {rule.emoji}
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-black text-sm sm:text-base ${rule.color} leading-tight`}>
                            {rule.title}
                        </h3>
                        {rule.titleAr && (
                            <span className={`text-xs sm:text-sm font-bold ${rule.color} opacity-60`} dir="rtl">
                                {rule.titleAr}
                            </span>
                        )}
                    </div>

                    {/* Toggle Icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isOpen ? rule.iconBg + ' text-white' : 'bg-white/80 ' + rule.color}`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`${rule.colorLight} border-2 ${rule.borderColor} border-t-0 rounded-b-2xl px-3.5 sm:px-4 pb-4 pt-3 -mt-2 space-y-3`}>
                            {/* Description */}
                            <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                                {rule.description}
                            </p>

                            {/* Letters */}
                            {rule.letters && (
                                <div className="bg-white/80 rounded-xl p-3 border border-white shadow-sm">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        {rule.lettersLabel}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2" dir="rtl">
                                        {rule.letters.split(' ').map((letter, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.05, type: 'spring', damping: 12 }}
                                                className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${rule.iconBg} text-white font-bold text-base sm:text-lg shadow-md border-2 border-white/30`}
                                            >
                                                {letter}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Example */}
                            {rule.example && (
                                <div className="bg-white/80 rounded-xl p-3 border border-white shadow-sm">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        ✏️ Contoh
                                    </p>
                                    <div className="text-center space-y-1">
                                        <p className="font-sans font-black text-2xl sm:text-3xl text-indigo-900 leading-tight" dir="rtl">
                                            {rule.example.arabic}
                                        </p>
                                        <p className={`text-xs sm:text-sm font-bold ${rule.color}`}>
                                            "{rule.example.latin}"
                                        </p>
                                        {rule.example.meaning && (
                                            <p className="text-[10px] sm:text-xs text-slate-400 font-semibold italic">
                                                {rule.example.meaning}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tip */}
                            {rule.tip && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-start gap-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2.5"
                                >
                                    <span className="text-lg shrink-0">💡</span>
                                    <p className="text-xs sm:text-sm font-bold text-amber-800 leading-snug">
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

/* ─── Category Section ─────────────────────────────────────────────────────── */

function CategorySection({ category, catIndex }: { category: TajwidCategory; catIndex: number }) {
    const [isExpanded, setIsExpanded] = useState(catIndex === 0); // First one open by default

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.15, type: 'spring', damping: 20 }}
            className="w-full"
        >
            {/* Category Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full group`}
            >
                <div className={`bg-gradient-to-r ${category.gradient} rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-white/20 transition-all duration-300 ${isExpanded ? 'rounded-b-none' : 'hover:shadow-xl hover:-translate-y-0.5'}`}>
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Emoji Badge */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner border-2 border-white/30 shrink-0">
                            {category.emoji}
                        </div>

                        {/* Title */}
                        <div className="flex-1 text-left min-w-0">
                            <h2 className="font-black text-white text-base sm:text-lg leading-tight drop-shadow-sm">
                                {category.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-white/70 font-bold mt-0.5" dir="rtl">
                                {category.subtitle}
                            </p>
                        </div>

                        {/* Badge & Toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="bg-white/20 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black text-white border border-white/30">
                                {category.rules.length} hukum
                            </span>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>

            {/* Rules List */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`bg-gradient-to-b ${category.gradientLight} border-2 ${category.borderColor} border-t-0 rounded-b-2xl sm:rounded-b-3xl p-3 sm:p-4 space-y-3`}>
                            {category.rules.map((rule, idx) => (
                                <RuleCard key={rule.id} rule={rule} index={idx} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

/* ─── Progress Tracker ─────────────────────────────────────────────────────── */

function ProgressTracker({ categories }: { categories: TajwidCategory[] }) {
    const totalRules = categories.reduce((sum, c) => sum + c.rules.length, 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-indigo-100 p-4 shadow-lg"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-sm text-indigo-900">Ringkasan Materi</span>
                </div>
                <span className="text-xs font-bold text-indigo-400">{totalRules} hukum</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                    <div key={cat.id} className={`bg-gradient-to-br ${cat.gradientLight} rounded-xl p-2.5 text-center border ${cat.borderColor}`}>
                        <span className="text-xl block mb-1">{cat.emoji}</span>
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-600 leading-tight block">
                            {cat.id === 'nun-mati' ? 'Nun Mati' : cat.id === 'mim-mati' ? 'Mim Mati' : 'Qalqalah'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">{cat.rules.length} hukum</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* ━━━ MAIN PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LearnTajwid() {
    return (
        <AppLayout title="Belajar Tajwid Dasar" fantasyBg>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full justify-center relative max-w-5xl mx-auto">

                {/* ── Sidebar (Desktop) ── */}
                <div className="hidden lg:flex flex-col items-center w-[280px] shrink-0 sticky top-28 pt-4 z-10 gap-4">
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
                    <div className="bg-[#1c1c3f]/80 backdrop-blur-md rounded-2xl border border-white/10 text-white p-4 w-full shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 opacity-50" />
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <span className="text-lg">🌙</span>
                            <span className="font-black text-sm text-purple-300">Tips dari Hufi!</span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-semibold relative z-10">
                            Tajwid artinya membaca Al-Qur'an dengan benar sesuai aturan. Yuk pelajari satu-satu, nanti kamu jadi pintar membaca Al-Qur'an! 📖
                        </p>
                    </div>

                    {/* Progress */}
                    <ProgressTracker categories={TAJWID_DATA} />

                    {/* Quiz CTA */}
                    <Link
                        href="/game/select"
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 border-2 border-white/20"
                    >
                        <Gamepad2 className="w-5 h-5" /> Coba Quiz Tajwid!
                    </Link>
                </div>

                {/* ── Main Content ── */}
                <div className="flex-1 w-full relative">

                    {/* Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 mb-5 border-2 border-white/20 shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner border-2 border-white/30 shrink-0">
                                📖
                            </div>
                            <div className="flex-1">
                                <h1 className="font-black text-white text-lg sm:text-xl leading-tight drop-shadow-sm flex items-center gap-2">
                                    Belajar Tajwid Dasar
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                                </h1>
                                <p className="text-xs sm:text-sm text-white/70 font-bold mt-0.5">
                                    Ayo pelajari cara membaca Al-Qur'an yang benar! 🌟
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-2 mt-3 relative z-10">
                            <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                <span className="text-[10px] sm:text-xs font-bold text-white">3 Kategori</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                <span className="text-[10px] sm:text-xs font-bold text-white">10 Hukum</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Mascot & Info */}
                    <div className="flex lg:hidden flex-col gap-3 mb-5">
                        <div className="bg-[#1c1c3f]/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                            <motion.img
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-14 h-14 object-contain shrink-0 drop-shadow-md"
                            />
                            <div>
                                <h3 className="font-black text-[12px] text-purple-300 flex items-center gap-1 mb-0.5">🌙 Tips dari Hufi!</h3>
                                <p className="text-[11px] text-white/80 font-semibold leading-relaxed">
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
                        className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-purple-100 p-4 sm:p-5 shadow-lg mb-5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="flex items-start gap-3 relative z-10">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-lg shadow-md shrink-0 border-2 border-white">
                                🤔
                            </div>
                            <div>
                                <h2 className="font-black text-sm sm:text-base text-indigo-900 mb-1.5">Apa itu Tajwid?</h2>
                                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                                    <strong className="text-purple-700">Tajwid</strong> adalah ilmu yang mempelajari cara membaca Al-Qur'an dengan <strong className="text-emerald-600">benar dan indah</strong>. 
                                    Dengan tajwid, kita tahu kapan harus membaca jelas, mendengung, samar, atau memantulkan huruf. 
                                    Yuk kenali hukum-hukum tajwid dasar! 🎓
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Sections */}
                    <div className="space-y-4 sm:space-y-5">
                        {TAJWID_DATA.map((category, catIndex) => (
                            <CategorySection key={category.id} category={category} catIndex={catIndex} />
                        ))}
                    </div>

                    {/* Bottom CTA - Quiz */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 mb-4"
                    >
                        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center border-2 border-white/20 shadow-xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="text-4xl sm:text-5xl mb-3"
                                >
                                    🏆
                                </motion.div>
                                <h3 className="font-black text-white text-lg sm:text-xl mb-2 drop-shadow-sm">
                                    Sudah Paham? Yuk Uji! ✨
                                </h3>
                                <p className="text-xs sm:text-sm text-white/70 font-bold mb-4 max-w-sm mx-auto">
                                    Coba quiz tajwid untuk menguji pemahamanmu! Raih skor 80 untuk lulus! 🎯
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                    <Link
                                        href="/game/select"
                                        className="bg-white text-indigo-700 font-black text-sm sm:text-base py-3 px-8 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 border-2 border-indigo-100"
                                    >
                                        <Gamepad2 className="w-5 h-5" /> Mulai Quiz Tajwid
                                    </Link>
                                    <Link
                                        href="/learn"
                                        className="text-white/80 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Kembali ke Huruf
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Progress (below content) */}
                    <div className="lg:hidden mb-8">
                        <ProgressTracker categories={TAJWID_DATA} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
