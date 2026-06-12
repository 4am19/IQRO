import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';
import { Volume2, BookOpen, X, Star, Sparkles, Mic, Snail, CheckCircle2, ChevronDown, ChevronUp, Gamepad2 } from 'lucide-react';

// Tipe Letter dari database
interface Letter {
    id: number;
    char_arabic: string;
    name: string;
    read_latin: string;
    pronunciation_desc?: string | null;
    audio_path?: string | null;
    example_word?: string | null;
    example_image_path?: string | null;
    order_sequence?: number;
    fathah?:  { latin: string; arabic: string } | null;
    kasrah?:  { latin: string; arabic: string } | null;
    dhammah?: { latin: string; arabic: string } | null;
}

interface Props {
    letters: Letter[];
    student?: { id: number; name: string } | null;
}

const LETTER_EXTRA: Record<string, { desc: string; }> = {
    'ا': { desc: 'Mulut terbuka lebar. Suara keluar tanpa hambatan.' },
    'ب': { desc: 'Kedua bibir tertutup lalu dibuka dengan lembut.' },
    'ت': { desc: 'Ujung lidah menempel pada pangkal gigi seri atas.' },
    'ث': { desc: 'Ujung lidah dikeluarkan sedikit di antara gigi.' },
    'ج': { desc: 'Tengah lidah menyentuh langit-langit mulut.' },
    'ح': { desc: 'Keluar dari tengah tenggorokan secara bersih.' },
    'خ': { desc: 'Suara agak serak keluar dari ujung tenggorokan.' },
};
const DEFAULT_EXTRA = { desc: 'Pelajari cara membaca huruf ini dengan benar.' };
function getExtra(char: string) { return LETTER_EXTRA[char] ?? DEFAULT_EXTRA; }

// ── Color palette for letter cards (RTL layout matching reference) ───────────
const COL_COLORS = [
    { bg: 'bg-[#fffbeb]', border: 'border-[#fcd34d]/60', text: 'text-[#d97706]', arabic: 'text-[#d97706]', shadow: 'shadow-yellow-500/10' }, // Alif (Yellow)
    { bg: 'bg-[#fff7ed]', border: 'border-[#fdba74]/60', text: 'text-[#ea580c]', arabic: 'text-[#ea580c]', shadow: 'shadow-orange-500/10' }, // Ba (Orange)
    { bg: 'bg-[#fdf2f8]', border: 'border-[#f9a8d4]/60', text: 'text-[#db2777]', arabic: 'text-[#db2777]', shadow: 'shadow-pink-500/10' }, // Ta (Pink)
    { bg: 'bg-[#faf5ff]', border: 'border-[#d8b4fe]/60', text: 'text-[#9333ea]', arabic: 'text-[#9333ea]', shadow: 'shadow-purple-500/10' }, // Tsa (Purple)
    { bg: 'bg-[#f0f9ff]', border: 'border-[#7dd3fc]/60', text: 'text-[#0284c7]', arabic: 'text-[#0284c7]', shadow: 'shadow-blue-500/10' }, // Jim (Blue)
    { bg: 'bg-[#f0fdf4]', border: 'border-[#86efac]/60', text: 'text-[#16a34a]', arabic: 'text-[#16a34a]', shadow: 'shadow-green-500/10' }, // Ha (Green)
    { bg: 'bg-[#f0fdf4]', border: 'border-[#86efac]/60', text: 'text-[#16a34a]', arabic: 'text-[#16a34a]', shadow: 'shadow-green-500/10' }, // Kha (Green)
];

function getRowColor(idx: number, totalCols: number = 7) {
    return COL_COLORS[idx % totalCols];
}

function HarakatCard({ entry, label, color, onClick }: { entry: { latin: string; arabic: string }; label: string; color: { bg: string; border: string; text: string; btn: string }; onClick: () => void; }) {
    return (
        <button onClick={onClick} className={`relative flex flex-col items-center justify-center py-4 px-2 landscape:py-2 lg:landscape:py-4 rounded-2xl border ${color.border} ${color.bg} hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm group`}>
            <span className={`text-[13px] landscape:text-[10px] lg:landscape:text-[13px] font-black ${color.text} mb-2 landscape:mb-0 lg:landscape:mb-2`}>{label}</span>
            
            <div className="relative w-full flex items-center justify-center pt-2 pb-4 mb-2 landscape:pt-1 landscape:pb-1 landscape:mb-0 lg:landscape:pt-2 lg:landscape:pb-4 lg:landscape:mb-2">
                <span className={`font-sans font-extrabold ${color.text} text-5xl landscape:text-3xl lg:landscape:text-5xl leading-none`}>
                    {entry.arabic}
                </span>
            </div>
            
            <div className={`flex items-center justify-center gap-1.5 mt-2 landscape:mt-1 lg:landscape:mt-2 pb-1`}>
                <span className={`text-base landscape:text-[11px] lg:landscape:text-base font-black ${color.text} leading-tight`}>{entry.latin}</span>
                <div className={`w-5 h-5 landscape:w-4 landscape:h-4 lg:landscape:w-5 lg:landscape:h-5 rounded-full flex items-center justify-center ${color.btn} text-white shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                    <Volume2 className="w-3 h-3 landscape:w-2.5 landscape:h-2.5 lg:landscape:w-3 lg:landscape:h-3" />
                </div>
            </div>
        </button>
    );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TAJWID DASAR — Inline Learning Section
   ══════════════════════════════════════════════════════════════════════════════ */

interface TajwidRule {
    id: string; title: string; titleAr?: string; emoji: string;
    color: string; colorLight: string; borderColor: string; iconBg: string;
    description: string; letters?: string; lettersLabel?: string;
    example?: { arabic: string; latin: string; meaning?: string };
    tip?: string;
}

interface TajwidCategory {
    id: string; title: string; emoji: string; subtitle: string;
    gradient: string; gradientLight: string; borderColor: string;
    rules: TajwidRule[];
}

const TAJWID_DATA: TajwidCategory[] = [
    {
        id: 'nun-mati', title: 'Hukum Nun Mati & Tanwin', emoji: '🌙',
        subtitle: 'نْ — Nun Sukun & Tanwin',
        gradient: 'from-blue-500 to-indigo-600', gradientLight: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200',
        rules: [
            {
                id: 'izhar', title: 'Izhar Halqi', titleAr: 'إظهار', emoji: '💎',
                color: 'text-sky-700', colorLight: 'bg-sky-50', borderColor: 'border-sky-200', iconBg: 'bg-sky-500',
                description: 'Dibaca JELAS dan TERANG tanpa mendengung. Huruf Nun Mati/Tanwin harus terdengar jelas.',
                letters: 'ء ه ع ح غ خ', lettersLabel: 'Huruf Halqi (Tenggorokan)',
                example: { arabic: 'مَنْ أَعْطَى', latin: "Man 'a'tho", meaning: 'Barangsiapa yang memberi' },
                tip: 'Ingat: Hurufnya dari TENGGOROKAN, jadi Nun dibaca jelas!',
            },
            {
                id: 'idgham-bighunnah', title: 'Idgham Bighunnah', titleAr: 'إدغام بغنة', emoji: '🎵',
                color: 'text-violet-700', colorLight: 'bg-violet-50', borderColor: 'border-violet-200', iconBg: 'bg-violet-500',
                description: 'Dimasukkan dengan DENGUNG (suara dari hidung). Nun Mati "lebur" ke huruf berikutnya sambil berdengung.',
                letters: 'ي ن م و', lettersLabel: 'Huruf YANMU (يَنْمُو)',
                example: { arabic: 'مَنْ يَعْمَلْ', latin: "May ya'mal", meaning: 'Barangsiapa yang mengerjakan' },
                tip: 'Cara hafal mudah: YANMU → Ya, Nun, Mim, Wawu!',
            },
            {
                id: 'idgham-bilaghunnah', title: 'Idgham Bilaghunnah', titleAr: 'إدغام بلاغنة', emoji: '🔔',
                color: 'text-amber-700', colorLight: 'bg-amber-50', borderColor: 'border-amber-200', iconBg: 'bg-amber-500',
                description: 'Dimasukkan TANPA dengung. Nun Mati langsung lebur ke huruf Lam atau Ra.',
                letters: 'ل ر', lettersLabel: 'Hanya 2 huruf',
                example: { arabic: 'مِنْ رَبِّهِمْ', latin: 'Mir rabbihim', meaning: 'Dari Tuhan mereka' },
                tip: 'Hanya Lam (ل) dan Ra (ر) — langsung masuk tanpa nge-dung!',
            },
            {
                id: 'iqlab', title: 'Iqlab', titleAr: 'إقلاب', emoji: '🔄',
                color: 'text-emerald-700', colorLight: 'bg-emerald-50', borderColor: 'border-emerald-200', iconBg: 'bg-emerald-500',
                description: 'Mengubah bunyi Nun Mati/Tanwin menjadi bunyi MIM (م) dengan dengung. Bibir harus menutup.',
                letters: 'ب', lettersLabel: 'Hanya 1 huruf: Ba',
                example: { arabic: 'أَنْبِئْهُمْ', latin: "Ambi'hum", meaning: 'Beritahukanlah kepada mereka' },
                tip: 'Ketemu Ba (ب), ubah Nun jadi Mim! Tutup bibir ya! 👄',
            },
            {
                id: 'ikhfa', title: 'Ikhfa Haqiqi', titleAr: 'إخفاء حقيقي', emoji: '🌊',
                color: 'text-cyan-700', colorLight: 'bg-cyan-50', borderColor: 'border-cyan-200', iconBg: 'bg-cyan-500',
                description: 'Dibaca SAMAR-SAMAR, antara jelas dan dengung. Bunyi Nun Mati dibaca halus.',
                letters: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك', lettersLabel: '15 huruf sisanya',
                example: { arabic: 'مِنْ قَبْلُ', latin: 'Min qoblu', meaning: 'Dari sebelumnya' },
                tip: 'Semua huruf yang BUKAN Izhar, Idgham, dan Iqlab!',
            },
        ],
    },
    {
        id: 'mim-mati', title: 'Hukum Mim Mati', emoji: '⭐',
        subtitle: 'مْ — Mim Sukun',
        gradient: 'from-pink-500 to-rose-600', gradientLight: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-200',
        rules: [
            {
                id: 'ikhfa-syafawi', title: 'Ikhfa Syafawi', titleAr: 'إخفاء شفوي', emoji: '👄',
                color: 'text-pink-700', colorLight: 'bg-pink-50', borderColor: 'border-pink-200', iconBg: 'bg-pink-500',
                description: 'Dibaca samar di BIBIR dengan sedikit dengung. Mim Mati bertemu huruf Ba.',
                letters: 'ب', lettersLabel: 'Hanya 1 huruf: Ba',
                example: { arabic: 'تَرْمِيْهِمْ بِحِجَارَةٍ', latin: 'Tarmiihim bihijaarotin', meaning: 'Melempari mereka dengan batu' },
                tip: 'Mim ketemu Ba = samar di bibir! Dengungnya pelan ya 🤫',
            },
            {
                id: 'idgham-mimi', title: 'Idgham Mimi', titleAr: 'إدغام ميمي', emoji: '🤝',
                color: 'text-fuchsia-700', colorLight: 'bg-fuchsia-50', borderColor: 'border-fuchsia-200', iconBg: 'bg-fuchsia-500',
                description: 'Mim bertemu Mim — dilebur jadi SATU Mim panjang dengan dengung.',
                letters: 'م', lettersLabel: 'Hanya 1 huruf: Mim',
                example: { arabic: 'لَهُمْ مَا يَشَاؤُنَ', latin: 'Lahum maa yasyaa-uun', meaning: 'Bagi mereka apa yang mereka kehendaki' },
                tip: 'Mim + Mim = Mim panjang! Seperti teman kembar! 👯',
            },
            {
                id: 'izhar-syafawi', title: 'Izhar Syafawi', titleAr: 'إظهار شفوي', emoji: '🔊',
                color: 'text-orange-700', colorLight: 'bg-orange-50', borderColor: 'border-orange-200', iconBg: 'bg-orange-500',
                description: 'Dibaca JELAS di bibir tanpa dengung saat Mim Mati bertemu huruf selain Ba dan Mim.',
                letters: '26 huruf lainnya', lettersLabel: 'Semua huruf selain ب dan م',
                example: { arabic: 'أَمْ لَمْ', latin: 'Am lam', meaning: 'Ataukah tidak' },
                tip: 'Bukan Ba, bukan Mim = baca Mim-nya JELAS! 📢',
            },
        ],
    },
    {
        id: 'qalqalah', title: 'Qalqalah (Pantulan)', emoji: '🏀',
        subtitle: 'قلقلة — Memantul',
        gradient: 'from-amber-500 to-orange-600', gradientLight: 'from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
        rules: [
            {
                id: 'qalqalah-sughra', title: 'Qalqalah Sughra', titleAr: 'قلقلة صغرى', emoji: '🔸',
                color: 'text-amber-700', colorLight: 'bg-amber-50', borderColor: 'border-amber-200', iconBg: 'bg-amber-500',
                description: 'Pantulan KECIL — huruf Qalqalah berharakat sukun di TENGAH kata. Pantulannya ringan.',
                letters: 'ب ج د ط ق', lettersLabel: 'Huruf Qalqalah: BA-JU-DI-TO-QO',
                example: { arabic: 'يَجْعَلُونَ', latin: "Yaj'aluun", meaning: 'Mereka menjadikan' },
                tip: 'Sukun di TENGAH kata = pantul kecil! Seperti bola kecil 🏓',
            },
            {
                id: 'qalqalah-kubra', title: 'Qalqalah Kubra', titleAr: 'قلقلة كبرى', emoji: '🔶',
                color: 'text-orange-700', colorLight: 'bg-orange-50', borderColor: 'border-orange-200', iconBg: 'bg-orange-500',
                description: 'Pantulan BESAR — huruf Qalqalah di AKHIR kata (saat berhenti/waqof). Pantulannya kuat dan jelas.',
                letters: 'ب ج د ط ق', lettersLabel: 'Huruf Qalqalah: BA-JU-DI-TO-QO',
                example: { arabic: 'وَالْفَلَقِ', latin: 'Wal falaq', meaning: 'Dan waktu subuh' },
                tip: 'Di AKHIR kata = pantul besar! Seperti bola basket! 🏀',
            },
        ],
    },
];

/* ─── Expandable Tajwid Rule Card ──────────────────────────────────────────── */

function TajwidRuleCard({ rule, index }: { rule: TajwidRule; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', damping: 22 }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left rounded-2xl border-2 ${rule.borderColor} ${rule.colorLight} p-3 sm:p-3.5 transition-all duration-300 active:scale-[0.98] ${isOpen ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
            >
                <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 ${rule.iconBg} rounded-xl flex items-center justify-center text-base sm:text-lg shadow-md shrink-0 border-2 border-white/30`}>
                        {rule.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-black text-xs sm:text-sm ${rule.color} leading-tight`}>{rule.title}</h4>
                        {rule.titleAr && <span className={`text-[10px] sm:text-xs font-bold ${rule.color} opacity-50`} dir="rtl">{rule.titleAr}</span>}
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${isOpen ? rule.iconBg + ' text-white' : 'bg-white/80 ' + rule.color}`}>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className={`${rule.colorLight} border-2 ${rule.borderColor} border-t-0 rounded-b-2xl px-3 sm:px-3.5 pb-3.5 pt-2.5 -mt-2 space-y-2.5`}>
                            <p className="text-[11px] sm:text-xs text-slate-700 font-semibold leading-relaxed">{rule.description}</p>

                            {rule.letters && (
                                <div className="bg-white/80 rounded-xl p-2.5 border border-white shadow-sm">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{rule.lettersLabel}</p>
                                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                                        {rule.letters.split(' ').map((l, i) => (
                                            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04, type: 'spring', damping: 14 }}
                                                className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${rule.iconBg} text-white font-bold text-sm sm:text-base shadow-md border-2 border-white/30`}
                                            >{l}</motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {rule.example && (
                                <div className="bg-white/80 rounded-xl p-2.5 border border-white shadow-sm text-center space-y-0.5">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">✏️ Contoh</p>
                                    <p className="font-sans font-black text-xl sm:text-2xl text-indigo-900 leading-tight" dir="rtl">{rule.example.arabic}</p>
                                    <p className={`text-[11px] sm:text-xs font-bold ${rule.color}`}>"{rule.example.latin}"</p>
                                    {rule.example.meaning && <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold italic">{rule.example.meaning}</p>}
                                </div>
                            )}

                            {rule.tip && (
                                <div className="flex items-start gap-1.5 bg-amber-50 border-2 border-amber-200 rounded-xl px-2.5 py-2">
                                    <span className="text-sm shrink-0">💡</span>
                                    <p className="text-[11px] sm:text-xs font-bold text-amber-800 leading-snug">{rule.tip}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Tajwid Category Accordion ────────────────────────────────────────────── */

function TajwidCategoryAccordion({ category, catIndex }: { category: TajwidCategory; catIndex: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.12, type: 'spring', damping: 22 }}
        >
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full">
                <div className={`bg-gradient-to-r ${category.gradient} rounded-2xl p-3.5 sm:p-4 shadow-lg border-2 border-white/20 transition-all duration-300 ${isExpanded ? 'rounded-b-none' : 'hover:shadow-xl hover:-translate-y-0.5'}`}>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border-2 border-white/30 shrink-0">
                            {category.emoji}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <h3 className="font-black text-white text-sm sm:text-base leading-tight drop-shadow-sm">{category.title}</h3>
                            <p className="text-[10px] sm:text-xs text-white/60 font-bold mt-0.5" dir="rtl">{category.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black text-white border border-white/20">
                                {category.rules.length} hukum
                            </span>
                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className={`bg-gradient-to-b ${category.gradientLight} border-2 ${category.borderColor} border-t-0 rounded-b-2xl p-3 space-y-2.5`}>
                            {category.rules.map((rule, idx) => (
                                <TajwidRuleCard key={rule.id} rule={rule} index={idx} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── TajwidSection — Container used inside LearnIndex ─────────────────────── */

function TajwidSection() {
    return (
        <div className="mt-10 mb-8 space-y-4">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border-2 border-white/20 shadow-xl relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border-2 border-white/30 shrink-0">
                        📖
                    </div>
                    <div className="flex-1">
                        <h2 className="font-black text-white text-base sm:text-lg leading-tight drop-shadow-sm flex items-center gap-2">
                            Belajar Tajwid Dasar
                            <Sparkles className="w-4 h-4 text-amber-300" />
                        </h2>
                        <p className="text-[10px] sm:text-xs text-white/60 font-bold mt-0.5">
                            Ayo pelajari cara membaca Al-Qur'an yang benar! 🌟
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2.5 relative z-10">
                    <div className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-white">3 Kategori</span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-white">10 Hukum</span>
                    </div>
                </div>
            </motion.div>

            {/* "What is Tajwid?" card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-purple-100 p-3.5 sm:p-4 shadow-lg relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
                <div className="flex items-start gap-2.5 relative z-10">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-base shadow-md shrink-0 border-2 border-white">
                        🤔
                    </div>
                    <div>
                        <h3 className="font-black text-xs sm:text-sm text-indigo-900 mb-1">Apa itu Tajwid?</h3>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-relaxed">
                            <strong className="text-purple-700">Tajwid</strong> adalah ilmu cara membaca Al-Qur'an dengan <strong className="text-emerald-600">benar dan indah</strong>.
                            Dengan tajwid, kita tahu kapan harus membaca jelas, mendengung, samar, atau memantulkan huruf. Yuk kenali hukum-hukum tajwid dasar! 🎓
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Category Accordions */}
            {TAJWID_DATA.map((cat, idx) => (
                <TajwidCategoryAccordion key={cat.id} category={cat} catIndex={idx} />
            ))}

        </div>
    );
}

export default function LearnIndex({ letters = [], student }: Props) {
    const [view, setView] = useState<'grid' | 'detail'>('grid');
    const [currentIdx, setCurrentIdx] = useState(0);
    const { playAudio } = useAudioPlayer();

    const letter = letters[currentIdx] ?? null;
    const extra = letter ? getExtra(letter.char_arabic) : DEFAULT_EXTRA;

    if (!letters || letters.length === 0) {
        return (
            <AppLayout title="Belajar Huruf Hijaiyah" fantasyBg>
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/70">
                    <div className="text-6xl">📖</div>
                    <p className="font-extrabold text-lg">Data huruf belum tersedia</p>
                </div>
            </AppLayout>
        );
    }

    // ── GRID VIEW (Main Content) ─────────────────────────────────────────────
    return (
        <AppLayout title="Semua Huruf Hijaiyah" fantasyBg>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full justify-center relative">

                {/* ── Left side: Mascot + Info Box ── */}
                <div className="hidden lg:flex flex-col items-center w-[280px] shrink-0 sticky top-28 pt-8 z-10">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                        <img
                            src="/images/maskod/sprite_05.png"
                            alt="Maskot Hufi"
                            className="w-56 h-56 object-contain drop-shadow-2xl relative z-10"
                        />
                    </motion.div>

                    <div className="bg-[#1c1c3f]/80 backdrop-blur-md rounded-2xl border border-white/10 text-white p-5 w-full shadow-xl mt-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 opacity-50" />
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <span className="text-lg">💡</span>
                            <span className="font-black text-sm text-amber-300">Tahukah kamu?</span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-semibold relative z-10">
                            Hijaiyah adalah huruf dasar dalam bahasa Arab yang berjumlah 29 huruf (atau 30 jika menyertakan Lam Alif).
                        </p>
                    </div>
                </div>

                {/* ── Right Main Content Container ── */}
                <div className="flex-1 w-full max-w-[850px] relative">
                    
                    {/* Inner Header Box */}
                    <div className="bg-[#2a245c]/90 rounded-[24px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border border-white/10 shadow-lg relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#5b51d8] rounded-[16px] flex items-center justify-center shadow-md shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-white text-lg sm:text-xl flex items-center gap-2">
                                    Semua Huruf Hijaiyah
                                    <span className="text-amber-300">✨</span>
                                </h1>
                                <p className="text-xs text-white/60 font-semibold mt-0.5">
                                    Yuk, belajar mengenal huruf Hijaiyah! Klik huruf untuk mendengar cara bacanya.
                                </p>
                            </div>
                        </div>
                        <button
                            className="bg-[#5b51d8] hover:bg-indigo-500 text-white px-5 py-3 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-all active:scale-95 shadow-md whitespace-nowrap border border-indigo-400/30"
                            onClick={() => { if (letters[0]) playAudio(letters[0].char_arabic, letters[0].name); }}
                        >
                            <Volume2 className="w-4 h-4" />
                            Ketuk untuk suara
                        </button>
                    </div>

                    {/* Mobile Mascot & Info (Visible only on small screens) */}
                    <div className="flex lg:hidden flex-col items-center gap-3 mb-6 bg-[#1c1c3f]/80 p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4 w-full">
                            <img src="/images/maskod/sprite_05.png" alt="Maskot Hufi" className="w-16 h-16 object-contain shrink-0 drop-shadow-md" />
                            <div>
                                <h3 className="font-black text-[12px] text-amber-300 flex items-center gap-1 mb-1">💡 Tahukah kamu?</h3>
                                <p className="text-[11px] text-white/80 font-semibold leading-relaxed">
                                    Hijaiyah adalah huruf dasar dalam bahasa Arab yang berjumlah 29 huruf (atau 30 jika menyertakan Lam Alif).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Letter Grid */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
                        dir="rtl"
                        className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4 relative pb-10 mb-12"
                    >
                        {letters.map((l, idx) => {
                            const color = getRowColor(idx);
                            
                            return (
                                <motion.button
                                    key={l.id}
                                    variants={{
                                        hidden:  { opacity: 0, scale: 0.8, y: 10 },
                                        visible: { opacity: 1, scale: 1, y: 0 },
                                    }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        playAudio(l.char_arabic, l.name);
                                        setCurrentIdx(idx);
                                        setView('detail');
                                    }}
                                    className={`relative flex flex-col items-center justify-between rounded-[20px] p-2.5 sm:p-3 min-h-[100px] sm:min-h-[110px] ${color.bg} border-2 ${color.border} ${color.shadow} transition-all duration-200`}
                                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                >
                                    <div className="flex-1 flex items-center justify-center w-full mb-2">
                                        <span className={`font-arabic font-extrabold ${color.arabic} text-[2.5rem] sm:text-[3rem] leading-tight`}>
                                            {l.char_arabic}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] sm:text-[12px] mt-3 pb-1 ${color.text} font-black leading-tight truncate w-full text-center opacity-90 tracking-wide`} dir="ltr">
                                        {l.name}
                                    </span>
                                </motion.button>
                            );
                        })}

                        {/* Bottom Floating Badge */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max">
                            <div className="bg-[#2a245c] rounded-full px-6 py-2 border border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.4)] flex items-center gap-2">
                                <span className="text-amber-400 text-lg">⭐</span>
                                <span className="text-xs font-bold text-white/90">{letters.length} huruf tersedia</span>
                                <span className="text-amber-300 text-sm">✨</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ══════════════════════════════════════════════════════════════════ */}
                    {/* ── TAJWID DASAR — Inline Section ── */}
                    {/* ══════════════════════════════════════════════════════════════════ */}
                    <TajwidSection />
                </div>
            </div>

            {/* ── DETAIL MODAL OVERLAY (WIDE DESIGN) ── */}
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {view === 'detail' && letter && (
                        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 landscape:p-2 lg:landscape:p-6 overflow-y-auto">
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-[#0b1147]/80 backdrop-blur-md"
                                onClick={() => setView('grid')}
                            />

                            {/* Modal Box */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white rounded-[36px] landscape:rounded-[24px] lg:landscape:rounded-[36px] p-6 sm:p-8 landscape:p-3 lg:landscape:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)] relative z-10 w-full max-w-[780px] my-auto overflow-hidden landscape:max-w-[600px] lg:landscape:max-w-[780px]"
                            >
                                {/* Decorative Background Blobs */}
                                <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
                                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

                                {/* Close Button */}
                                <button 
                                    onClick={() => setView('grid')}
                                    className="absolute top-5 right-5 landscape:top-3 landscape:right-3 lg:landscape:top-5 lg:landscape:right-5 bg-slate-100 hover:bg-rose-500 text-slate-400 hover:text-white p-2 rounded-full transition-all duration-300 shadow-sm z-30 group border-2 border-transparent hover:border-rose-600"
                                >
                                    <X className="w-5 h-5 landscape:w-4 landscape:h-4 lg:landscape:w-5 lg:landscape:h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                <div className="flex flex-col gap-6 landscape:gap-3 lg:landscape:gap-6 relative z-20">
                                    {/* ── TOP SECTION (Split Layout) ── */}
                                    <div className="flex flex-col md:flex-row landscape:flex-row gap-6 landscape:gap-3 lg:landscape:gap-6 items-center md:items-start landscape:items-center">
                                        
                                        {/* Left: Mascot & Info */}
                                        <div className="hidden md:flex landscape:flex flex-col items-center w-[180px] landscape:w-[140px] lg:landscape:w-[180px] shrink-0 relative pt-2 landscape:pt-0">
                                            <motion.div 
                                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-2.5 landscape:p-1.5 lg:landscape:p-2.5 shadow-lg shadow-indigo-500/30 w-full mb-4 landscape:mb-2 lg:landscape:mb-4 relative"
                                            >
                                                <div className="flex items-center gap-2 landscape:gap-1 lg:landscape:gap-2">
                                                    <Star className="text-amber-300 fill-amber-300 w-6 h-6 landscape:w-4 landscape:h-4 lg:landscape:w-6 lg:landscape:h-6 drop-shadow-sm" />
                                                    <div className="leading-tight">
                                                        <div className="font-extrabold text-xs landscape:text-[9px] lg:landscape:text-xs text-yellow-300">Huruf ke-{currentIdx + 1}</div>
                                                        <div className="text-[10px] landscape:text-[8px] lg:landscape:text-[10px] opacity-90 font-semibold">dari {letters.length} huruf</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                                                className="bg-slate-50 border-2 border-indigo-100 rounded-2xl p-3 landscape:p-1.5 lg:landscape:p-3 text-center mb-3 landscape:mb-1 lg:landscape:mb-3 relative shadow-md"
                                            >
                                                <p className="text-xs landscape:text-[9px] lg:landscape:text-xs font-bold text-indigo-900">Yuk, belajar mengenal huruf Hijaiyah!</p>
                                                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-50 border-b-2 border-r-2 border-indigo-100 transform rotate-45"></div>
                                            </motion.div>
                                            
                                            <motion.img 
                                                animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                src="/images/maskod/sprite_05.png" alt="Mascot" className="w-36 h-36 landscape:w-20 landscape:h-20 lg:landscape:w-36 lg:landscape:h-36 object-contain drop-shadow-2xl" 
                                            />
                                        </div>

                                        {/* Right: Main Letter & Harakats */}
                                        <div className="flex-1 flex flex-col items-center w-full">
                                            {/* Large Box */}
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
                                                className="w-40 h-40 sm:w-52 sm:h-52 landscape:w-24 landscape:h-24 lg:landscape:w-52 lg:landscape:h-52 rounded-[36px] landscape:rounded-[20px] lg:landscape:rounded-[36px] bg-gradient-to-br from-[#f8f9ff] to-[#eef1ff] border-4 landscape:border-2 lg:landscape:border-4 border-white shadow-[0_15px_40px_rgba(99,102,241,0.25)] flex items-center justify-center relative group"
                                            >
                                                <span className="font-sans font-black text-[#3730a3] select-none leading-none drop-shadow-md group-hover:scale-105 transition-transform duration-300 text-[7rem] landscape:text-[4rem] lg:landscape:text-[7rem]">
                                                    {letter.char_arabic}
                                                </span>
                                                <button onClick={() => playAudio(letter.char_arabic, letter.name)}
                                                    className="absolute -bottom-2 -right-2 w-14 h-14 landscape:w-8 landscape:h-8 lg:landscape:w-14 lg:landscape:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all active:scale-90 border-[3px] landscape:border-2 lg:landscape:border-[3px] border-white group-hover:shadow-indigo-500/60 group-hover:-translate-y-1">
                                                    <Volume2 className="w-7 h-7 landscape:w-4 landscape:h-4 lg:landscape:w-7 lg:landscape:h-7" />
                                                </button>
                                            </motion.div>
                                            
                                            <motion.h2 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                                className="text-4xl landscape:text-xl lg:landscape:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mt-5 landscape:mt-1 lg:landscape:mt-5 leading-none"
                                            >
                                                {letter.name}
                                            </motion.h2>
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-base landscape:text-[10px] lg:landscape:text-base text-slate-500 font-bold mt-1.5 landscape:mt-0 lg:landscape:mt-1.5">Dibaca: <strong className="text-indigo-600 text-lg landscape:text-[12px] lg:landscape:text-lg">"{letter.read_latin}"</strong></motion.p>
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xs landscape:text-[9px] lg:landscape:text-xs text-slate-400 font-semibold italic mt-1.5 landscape:mt-0 lg:landscape:mt-1.5 text-center max-w-[280px]">
                                                {letter.pronunciation_desc ?? extra.desc}
                                            </motion.p>

                                            {/* Harakat Label */}
                                            <div className="flex items-center gap-1.5 mt-4 mb-2 landscape:mt-1 landscape:mb-1 lg:landscape:mt-4 lg:landscape:mb-2">
                                                <Sparkles className="w-3.5 h-3.5 landscape:hidden lg:landscape:block text-amber-400" />
                                                <span className="text-xs landscape:text-[9px] lg:landscape:text-xs font-extrabold text-indigo-900">Pilih Harakat</span>
                                                <Sparkles className="w-3.5 h-3.5 landscape:hidden lg:landscape:block text-amber-400" />
                                            </div>

                                            {/* Harakat Cards */}
                                            {(letter.fathah || letter.kasrah || letter.dhammah) && (
                                                <div className="grid grid-cols-3 gap-2 sm:gap-3 landscape:gap-1.5 lg:landscape:gap-3 w-full max-w-[400px] landscape:max-w-[250px] lg:landscape:max-w-[400px]" dir="rtl">
                                                    {letter.fathah && (
                                                        <HarakatCard 
                                                            entry={letter.fathah} 
                                                            label="Fathah" 
                                                            color={{ bg: 'bg-[#f0fdf4]', border: 'border-green-200', text: 'text-green-600', btn: 'bg-green-500' }}
                                                            onClick={() => playAudio(letter.fathah!.arabic)} 
                                                        />
                                                    )}
                                                    {letter.kasrah && (
                                                        <HarakatCard 
                                                            entry={letter.kasrah} 
                                                            label="Kasrah" 
                                                            color={{ bg: 'bg-[#faf5ff]', border: 'border-fuchsia-200', text: 'text-indigo-900', btn: 'bg-indigo-500' }}
                                                            onClick={() => playAudio(letter.kasrah!.arabic)} 
                                                        />
                                                    )}
                                                    {letter.dhammah && (
                                                        <HarakatCard 
                                                            entry={letter.dhammah} 
                                                            label="Dammah" 
                                                            color={{ bg: 'bg-[#fffbeb]', border: 'border-amber-200', text: 'text-amber-700', btn: 'bg-amber-500' }}
                                                            onClick={() => playAudio(letter.dhammah!.arabic)} 
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

        </AppLayout>
    );
}
