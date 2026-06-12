import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { X, Heart, Trophy, RotateCcw, ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Level { id: number; title: string; minimum_passing_score: number; }
interface Student { id: number; name: string; }
interface Props { level: Level; student?: Student | null; }

const TAJWID_QUESTIONS = [
    {
        question: "Hukum bacaan jika Nun Mati (نْ) bertemu huruf Ba (ب) adalah...",
        options: ["Iqlab", "Izhar", "Ikhfa", "Idgham"],
        correctIndex: 0,
        explanation: "Iqlab mengubah bunyi Nun Mati menjadi Mim (m)."
    },
    {
        question: "Huruf Qalqalah (pantulan) ada lima, yaitu...",
        options: ["ا, و, ي", "ب, ج, د, ط, ق", "ل, ر", "م, ن"],
        correctIndex: 1,
        explanation: "Cara mudah menghafalnya: BA-JU-DI-TO-QO."
    },
    {
        question: "Arti dari hukum bacaan 'Izhar' adalah...",
        options: ["Mendengung", "Samar-samar", "Jelas", "Memantul"],
        correctIndex: 2,
        explanation: "Izhar dibaca jelas, tidak boleh mendengung."
    },
    {
        question: "Jika Nun Mati bertemu huruf Lam (ل) atau Ra (ر), maka dibaca...",
        options: ["Idgham Bilaghunnah", "Ikhfa", "Idgham Bighunnah", "Iqlab"],
        correctIndex: 0,
        explanation: "Idgham Bilaghunnah (masuk tanpa dengung)."
    },
    {
        question: "Hukum bacaan jika Mim Mati (مْ) bertemu huruf Ba (ب) adalah...",
        options: ["Idgham Mimi", "Ikhfa Syafawi", "Izhar Syafawi", "Qalqalah"],
        correctIndex: 1,
        explanation: "Ikhfa Syafawi dibaca samar di bibir dengan sedikit dengung."
    },
    {
        question: "Cara membaca Idgham Bighunnah adalah...",
        options: ["Memasukkan dengan dengung", "Dibaca Jelas", "Memasukkan tanpa dengung", "Dipantulkan"],
        correctIndex: 0,
        explanation: "Bi-Ghunnah berarti 'dengan dengung'."
    },
    {
        question: "Manakah yang merupakan huruf Idgham Bighunnah?",
        options: ["ب, ج, د", "ي, ن, م, و", "ح, خ, ع, غ", "ل, ر"],
        correctIndex: 1,
        explanation: "Huruf Idgham Bighunnah (Yanmu): Ya, Nun, Mim, Wawu."
    },
    {
        question: "Jika Nun Mati (نْ) bertemu huruf Ta (ت), hukumnya adalah...",
        options: ["Iqlab", "Izhar", "Idgham", "Ikhfa Haqiqi"],
        correctIndex: 3,
        explanation: "Ikhfa Haqiqi dibaca samar antara Jelas dan Mendengung."
    },
    {
        question: "Membaca dengan cara memantulkan suara disebut dengan...",
        options: ["Qalqalah", "Ghunnah", "Izhar", "Mad"],
        correctIndex: 0,
        explanation: "Qalqalah artinya pantulan atau guncangan."
    },
    {
        question: "Hukum bacaan jika Mim Mati (مْ) bertemu huruf Mim (م) adalah...",
        options: ["Idgham Mimi / Mutamasilain", "Ikhfa Syafawi", "Izhar Syafawi", "Iqlab"],
        correctIndex: 0,
        explanation: "Dua huruf Mim yang sama bertemu, dilebur menjadi satu dengan dengung."
    }
];

// Confetti particle component
function ConfettiParticles() {
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{
                        backgroundColor: colors[i % colors.length],
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                    }}
                    animate={{
                        y: [0, window.innerHeight + 20],
                        x: [0, (Math.random() - 0.5) * 200],
                        rotate: [0, Math.random() * 720],
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: 1.5 + Math.random(),
                        delay: Math.random() * 0.3,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}

export default function Tajwid({ level, student }: Props) {
    const TOTAL = TAJWID_QUESTIONS.length;
    const [hearts, setHearts] = useState(3);
    const [score, setScore] = useState(0);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const startTime = useRef(Date.now());

    useEffect(() => {
        const shuffled = [...TAJWID_QUESTIONS].sort(() => Math.random() - 0.5).map(q => {
            const optionsWithState = q.options.map((opt, idx) => ({ text: opt, isCorrect: idx === q.correctIndex }));
            return { ...q, options: optionsWithState.sort(() => Math.random() - 0.5) };
        });
        setShuffledQuestions(shuffled);
    }, []);

    useEffect(() => {
        if (!isFinished) return;
        const finalScore = Math.min(100, Math.round((correctAnswers / TOTAL) * 100));
        if (!student) return;
        axios.post('/game/score', {
            student_id: student.id, level_id: level.id, score: finalScore,
            total_questions: TOTAL, correct_answers: correctAnswers,
            duration_seconds: Math.round((Date.now() - startTime.current) / 1000),
            wrong_answers: wrongAnswers,
        }).catch(console.error);
    }, [isFinished, correctAnswers, student, level, TOTAL, wrongAnswers]);

    const handleAnswer = (isCorrect: boolean) => {
        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setScore(prev => prev + Math.round(100 / TOTAL));
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        } else {
            setHearts(prev => Math.max(0, prev - 1));
            const currentQ = shuffledQuestions[currentIdx];
            if (currentQ) setWrongAnswers(prev => [...prev, currentQ.question]);
        }
        setTimeout(() => {
            setFeedback(null);
            if (currentIdx + 1 >= TOTAL) setIsFinished(true);
            else setCurrentIdx(prev => prev + 1);
        }, 2500);
    };

    const restart = () => {
        setHearts(3); setScore(0); setCurrentIdx(0); setCorrectAnswers(0);
        setIsFinished(false); setWrongAnswers([]); startTime.current = Date.now(); setFeedback(null);
    };

    if (shuffledQuestions.length === 0) return null;

    const currentQ = shuffledQuestions[currentIdx];
    const pct = (currentIdx / TOTAL) * 100;
    const finalCalculatedScore = Math.min(100, Math.round((correctAnswers / TOTAL) * 100));
    const passed = finalCalculatedScore >= level.minimum_passing_score;

    // ── Result Screen ──
    if (isFinished) {
        const stars = finalCalculatedScore >= 80 ? 3 : finalCalculatedScore >= 50 ? 2 : finalCalculatedScore > 0 ? 1 : 0;
        return (
            <div className="h-screen-safe overflow-auto bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 pt-8"
                style={{ backgroundImage: "url('/images/background%20level.png')" }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' as const, damping: 18 }}
                    className="w-full max-w-sm bg-white/95 backdrop-blur-md border-4 border-purple-300 rounded-[28px] p-5 shadow-2xl flex flex-col items-center gap-3 mt-4">
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-2 rounded-full font-black text-lg -mt-10 uppercase"
                        style={{ boxShadow: '0 4px 0 #4338ca' }}>
                        {passed ? 'Lulus Tajwid!' : 'Coba Lagi!'}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Skor Akhir</p>
                    <div className="w-20 h-20 bg-purple-50 border-4 border-purple-200 rounded-full flex items-center justify-center text-4xl font-black text-purple-600 shadow-inner">
                        {finalCalculatedScore}
                    </div>
                    <div className="flex gap-1 justify-center">
                        {[1,2,3].map(i => (
                            <motion.span key={i} initial={{ scale: 0, rotate: -20 }}
                                animate={i <= stars ? { scale: 1, rotate: 0 } : { scale: 0.6 }}
                                transition={{ delay: i * 0.2, type: 'spring' as const, damping: 10 }}
                                className={`text-4xl ${i <= stars ? 'text-purple-400' : 'text-slate-200'}`}
                            >★</motion.span>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full text-center">
                        <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                            <p className="text-[9px] text-emerald-700 font-black uppercase">Benar</p>
                            <p className="text-lg font-black text-emerald-600">{correctAnswers}</p>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-2 border border-rose-100">
                            <p className="text-[9px] text-rose-700 font-black uppercase">Salah</p>
                            <p className="text-lg font-black text-rose-600">{TOTAL - correctAnswers}</p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 mt-1">
                        {passed && (
                            <button onClick={() => router.visit(`/game/select?student_id=${student?.id ?? ''}`)}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black py-2.5 rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <Trophy className="w-4 h-4" /> Selesai
                            </button>
                        )}
                        <button onClick={restart}
                            className="w-full bg-white border-2 border-slate-200 text-slate-600 font-black py-2 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <RotateCcw className="w-4 h-4" /> Ulangi
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Game Screen ──
    const OPTION_THEMES = [
        { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
        { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
        { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
        { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    ];

    return (
        <div className="h-screen-safe overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col font-sans relative"
            style={{ backgroundImage: "url('/images/background%20level.png')" }}>

            {showConfetti && <ConfettiParticles />}

            {/* Header */}
            <div className="shrink-0 z-30 px-3 py-2 flex justify-between items-center w-full max-w-5xl mx-auto">
                <button onClick={() => router.visit(`/game/select?student_id=${student?.id ?? ''}`)}
                    className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-indigo-700 font-extrabold text-xs hover:bg-white shadow-sm transition active:scale-95">
                    <X className="w-3.5 h-3.5 stroke-[3]" /> Keluar
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="text-amber-500 text-sm">⭐</span>
                        <span className="text-xs font-black text-slate-700">Skor: {score}</span>
                    </div>
                    <div className="w-24 sm:w-32 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
                        </div>
                        <span className="text-[9px] font-black text-slate-500">{currentIdx + 1}/{TOTAL}</span>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
                    {[1,2,3].map(i => (
                        <Heart key={i} className={`w-3.5 h-3.5 transition-all ${i <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-300 fill-slate-300'}`} />
                    ))}
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 min-h-0 flex flex-row items-center justify-center max-w-5xl mx-auto w-full px-3 gap-4 z-10">

                {/* Question Card — Left */}
                <div className="w-[38%] flex flex-col items-center justify-center">
                    <div className="mb-2">
                        <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-sm border border-purple-200 whitespace-nowrap">
                            Soal Tajwid {currentIdx + 1} / {TOTAL}
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIdx}
                            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                            transition={{ type: 'spring', damping: 22 }}
                            className="bg-white/95 backdrop-blur-md border-[3px] border-white rounded-[20px] p-4 text-center shadow-xl relative w-full">
                            <h2 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 leading-snug">
                                {currentQ.question}
                            </h2>
                            <div className="absolute right-2 top-2 text-lg opacity-40">🌙</div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Options — Right */}
                <div className="w-[55%] flex flex-col gap-1.5 sm:gap-2">
                    {/* Feedback bar (inline, above options when answered) */}
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div key={feedback}
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className={`w-full py-2 px-3 rounded-2xl text-center font-black text-xs sm:text-sm border-2 shadow-md
                                    ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                                {feedback === 'correct' ? '🎉 Wah, benar sekali!' : '💡 Yuk pelajari!'}
                                <p className="text-[10px] sm:text-xs font-bold text-slate-600 mt-0.5">{currentQ.explanation}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentQ.options.map((opt: any, idx: number) => {
                        const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
                        let isWrong = feedback === 'wrong' && !opt.isCorrect;
                        let isCorrect = feedback === 'correct' && opt.isCorrect;

                        return (
                            <motion.button key={idx} disabled={!!feedback}
                                animate={isCorrect ? { scale: [1, 1.03, 1] } : isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                                transition={isCorrect ? { duration: 0.6, repeat: 2 } : { duration: 0.35 }}
                                whileHover={!feedback ? { scale: 1.01 } : {}}
                                whileTap={!feedback ? { scale: 0.97 } : {}}
                                onClick={() => handleAnswer(opt.isCorrect)}
                                className={`relative flex items-center w-full text-left px-3 py-2 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm border-2
                                    ${!feedback ? `${theme.bg} ${theme.text} ${theme.border} hover:shadow-md hover:brightness-105` : ''}
                                    ${isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-[0_0_20px_rgba(52,211,153,0.4)] ring-2 ring-emerald-300' : ''}
                                    ${isWrong ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60' : ''}
                                    ${feedback && !isCorrect && !isWrong ? `${theme.bg} ${theme.text} border-transparent opacity-40` : ''}
                                `}>
                                <span className="leading-tight flex-1 text-center">{opt.text}</span>
                                {isCorrect && (
                                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* Hint when no feedback */}
                    {!feedback && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-1.5 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mx-auto shadow-sm border border-white/50 mt-1">
                            <span className="text-amber-500 text-xs">⭐</span>
                            <span className="text-[10px] sm:text-xs font-bold text-indigo-900">Yuk, pilih jawaban yang benar!</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
