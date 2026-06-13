import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { useGameEngine, LetterWithHarakat } from '@/Hooks/useGameEngine';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';
import { Heart, Volume2, X, RotateCcw, ArrowLeft, SkipForward, Sparkles } from 'lucide-react';
import MascotHufi from '@/Components/MascotHufi';
import axios from 'axios';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';

interface Level { id: number; title: string; minimum_passing_score: number; }
interface Student { id: number; name: string; }
interface Props { letters: LetterWithHarakat[]; level: Level; student?: Student | null; nextLevel?: Level | null; }

const TOTAL = 10;

// Confetti particle component
const ConfettiParticles = React.memo(function ConfettiParticles() {
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div key={i} className="absolute w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length], left: `${Math.random() * 100}%`, top: '-10px' }}
                    animate={{ y: [0, window.innerHeight + 20], x: [0, (Math.random() - 0.5) * 200], rotate: [0, Math.random() * 720], opacity: [1, 1, 0] }}
                    transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3, ease: 'easeOut' }}
                />
            ))}
        </div>
    );
});

const StarRow = React.memo(function StarRow({ score }: { score: number }) {
    const n = score >= 80 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
    return (
        <div className="flex gap-1 justify-center">
            {[1,2,3].map(i => (
                <motion.span key={i} initial={{ scale: 0, rotate: -20 }}
                    animate={i <= n ? { scale: 1, rotate: 0 } : { scale: 0.6 }}
                    transition={{ delay: i * 0.2, type: 'spring' as const, damping: 10 }}
                    className={`text-4xl ${i <= n ? 'text-amber-400' : 'text-slate-200'}`}
                >★</motion.span>
            ))}
        </div>
    );
});

export default function MultipleChoice({ letters, level, student, nextLevel }: Props) {
    const { playAudio, preloadAudio } = useAudioPlayer();
    const [hearts, setHearts] = useState(3);
    const [showConfetti, setShowConfetti] = useState(false);
    const {
        score, correctAnswers, isFinished, feedback,
        generateQuestions, handleAnswer, getDurationSeconds,
        currentQuestion, currentIdx, wrongAnswersList
    } = useGameEngine(letters, 'multiple_choice', TOTAL);

    const restart = () => {
        setHearts(3);
        generateQuestions();
    };

    useEffect(() => {
        if (!isFinished || !student) return;
        axios.post('/game/score', {
            student_id: student.id, level_id: level.id, score,
            total_questions: TOTAL, correct_answers: correctAnswers,
            duration_seconds: getDurationSeconds(), wrong_answers: wrongAnswersList,
        }).catch(console.error);
    }, [isFinished]);

    useEffect(() => {
        if (feedback === 'wrong') setHearts(h => Math.max(0, h - 1));
        if (feedback === 'correct') { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); }
    }, [feedback]);

    // Preload audio for current question to eliminate delay
    useEffect(() => {
        if (currentQuestion) {
            preloadAudio(currentQuestion.target.displayChar);
            currentQuestion.options.forEach(opt => {
                preloadAudio(opt.displayChar);
            });
        }
    }, [currentQuestion, preloadAudio]);

    const levelName = level.title.replace(/Level \d+: /, '');
    const passed = score >= level.minimum_passing_score;

    // ── Loading ──
    if (!currentQuestion && !isFinished) {
        return (
            <div className="h-screen-safe flex items-center justify-center bg-slate-50">
                <MascotHufi pose="wave" className="w-48 h-48 animate-bounce" />
            </div>
        );
    }

    // ── Result Screen ──
    if (isFinished) {
        return (
            <div className="h-screen-safe overflow-auto bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 pt-8"
                style={{ backgroundImage: "url('/images/background%20level.png')" }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' as const, damping: 18 }}
                    className="w-full max-w-sm bg-white/95 backdrop-blur-md border-4 border-amber-300 rounded-[28px] p-5 shadow-2xl flex flex-col items-center gap-3 mt-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 px-6 py-2 rounded-full font-black text-lg -mt-10 uppercase tracking-wider"
                        style={{ boxShadow: '0 4px 0 #b45309' }}>
                        {passed ? 'Hebat!' : 'Hampir!'}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Skor Kamu</p>
                    <div className="w-20 h-20 bg-amber-50 border-4 border-amber-200 rounded-full flex items-center justify-center text-4xl font-black text-amber-600 shadow-inner">{score}</div>
                    <StarRow score={score} />
                    <div className="grid grid-cols-3 gap-2 w-full text-center">
                        <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                            <p className="text-[9px] text-emerald-700 font-black uppercase">Benar</p>
                            <p className="text-lg font-black text-emerald-600">{correctAnswers}</p>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-2 border border-rose-100">
                            <p className="text-[9px] text-rose-700 font-black uppercase">Salah</p>
                            <p className="text-lg font-black text-rose-600">{TOTAL - correctAnswers}</p>
                        </div>
                        <div className="bg-sky-50 rounded-xl p-2 border border-sky-100">
                            <p className="text-[9px] text-sky-700 font-black uppercase">Waktu</p>
                            <p className="text-sm font-black text-sky-600">{getDurationSeconds()}s</p>
                        </div>
                    </div>
                    {!passed && (
                        <p className="text-[10px] text-amber-700 bg-amber-50 rounded-xl px-3 py-1.5 text-center font-bold">
                            ⚠️ Minimum lulus: {level.minimum_passing_score}
                        </p>
                    )}
                    <div className="w-full flex flex-col gap-2 mt-1">
                       <div className="w-full flex gap-2">
                        <button onClick={() => router.visit(`/game/select${student ? `?student_id=${student.id}` : ''}`)}
                            className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm">
                            <ArrowLeft size={16} /> Kembali
                        </button>
                        
                        <button onClick={restart}
                            className={`flex-1 font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm shadow-sm border-2 ${
                                (nextLevel && passed)
                                ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg'
                            }`}>
                            <RotateCcw size={16} /> { (nextLevel && passed) ? 'Ulangi' : 'Main Lagi' }
                        </button>

                        {nextLevel && passed && (
                            <button onClick={() => router.visit(`/game/play/${nextLevel.id}${student ? `?student_id=${student.id}` : ''}`)}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm shadow-lg border-2 border-transparent">
                                Lanjut <SkipForward size={16} />
                            </button>
                        )}
                    </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Game Screen ──
    const pct = (currentIdx / TOTAL) * 100;
    const OPTION_COLORS = [
        { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
        { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
        { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
        { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' }
    ];

    return (
        <FullscreenWrapper>
        {/* Preload background image */}
        <link rel="preload" as="image" href="/images/background%20level.png" />
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
                <div className="w-[38%] flex flex-col items-center justify-center gap-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-lg border-2 border-white/50 whitespace-nowrap">
                        ✨ {levelName} ✨
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={currentIdx}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="bg-white/95 backdrop-blur-md border-[3px] border-white rounded-[20px] p-3 sm:p-4 text-center shadow-xl relative w-full">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 border-[3px] border-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-inner relative mb-2">
                                <span className="text-4xl sm:text-5xl font-arabic font-black text-indigo-900 leading-none drop-shadow-sm">
                                    {currentQuestion!.target.displayChar}
                                </span>
                            </div>
                            <button onClick={() => playAudio(currentQuestion!.target.displayChar, currentQuestion!.target.displayChar)}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold text-[10px] sm:text-xs px-4 py-1.5 rounded-full shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 mx-auto border-2 border-indigo-300/50">
                                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> Dengarkan
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    <p className="text-white/90 font-black text-xs sm:text-sm drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                        Huruf apakah ini?
                    </p>
                </div>

                {/* Options — Right */}
                <div className="w-[55%] flex flex-col gap-2">
                    {/* Feedback bar */}
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div key={feedback}
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className={`w-full py-2 px-3 rounded-2xl text-center font-black text-xs sm:text-sm border-2 shadow-md
                                    ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                                {feedback === 'correct' ? '🎉 Wah, kamu hebat sekali!' : '💡 Hmm, hampir benar!'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-2">
                        {currentQuestion!.options.map((opt, idx) => {
                            const style = OPTION_COLORS[idx % OPTION_COLORS.length];
                            let isWrong = feedback === 'wrong' && !opt.isCorrect;
                            let isCorrect = feedback === 'correct' && opt.isCorrect;

                            return (
                                <motion.button key={idx} id={`option-${idx}`}
                                    animate={isCorrect ? { scale: [1, 1.05, 1] } : isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                                    transition={isCorrect ? { duration: 0.5, repeat: 2 } : { duration: 0.35 }}
                                    whileHover={!feedback ? { scale: 1.03 } : {}}
                                    whileTap={!feedback ? { scale: 0.95 } : {}}
                                    onClick={() => { if (!feedback) { if (opt.isCorrect) playAudio(opt.displayChar, opt.displayChar); handleAnswer(opt.isCorrect); }}}
                                    disabled={!!feedback}
                                    className={`relative flex items-center justify-center h-12 sm:h-16 bg-white border-[3px] rounded-2xl shadow-md transition-all
                                        ${!feedback ? `hover:${style.bg} hover:${style.border}` : ''}
                                        ${isCorrect ? 'bg-emerald-50 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] ring-2 ring-emerald-300' : ''}
                                        ${isWrong ? 'bg-slate-50 border-slate-200 opacity-50' : 'border-slate-200'}
                                    `}>
                                    <span className={`text-base sm:text-xl font-black capitalize leading-none
                                        ${isCorrect ? 'text-emerald-600' : isWrong ? 'text-slate-400' : style.text}
                                    `}>{opt.name}</span>
                                    {isCorrect && (
                                        <motion.div className="absolute top-1 right-1" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {!feedback && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-1.5 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mx-auto shadow-sm border border-white/50">
                            <span className="text-amber-500 text-xs">💡</span>
                            <span className="text-[10px] sm:text-xs font-bold text-indigo-900">Yuk, pilih jawaban yang benar!</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
        </FullscreenWrapper>
    );
}
