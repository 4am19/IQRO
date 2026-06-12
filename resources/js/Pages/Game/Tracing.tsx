import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';
import { Trophy, RotateCcw, ArrowLeft, Eraser, CheckCircle2, Volume2, X } from 'lucide-react';
import axios from 'axios';

interface Letter { id: number; char_arabic: string; name: string; read_latin: string; }
interface Level { id: number; title: string; minimum_passing_score: number; }
interface Student { id: number; name: string; }
interface TracingProps { letters: Letter[]; level: Level; student?: Student | null; }

const TOTAL_LETTERS = 5;

export default function Tracing({ letters, level, student }: TracingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const { playAudio } = useAudioPlayer();

    const [queue, setQueue] = useState<Letter[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [coveredPoints, setCoveredPoints] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const startTime = useRef(Date.now());

    useEffect(() => {
        if (letters.length === 0) return;
        const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, TOTAL_LETTERS);
        setQueue(shuffled);
        setCurrentIdx(0);
        setScore(0);
        setIsFinished(false);
        startTime.current = Date.now();
    }, [letters]);

    const currentLetter = queue[currentIdx] ?? null;

    useEffect(() => {
        if (!currentLetter) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCoveredPoints(new Set());

        const size = Math.min(canvas.width, canvas.height) * 0.7;
        ctx.font = `${size}px Amiri, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#10b981';
        ctx.fillText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
        ctx.globalAlpha = 1;
        ctx.setLineDash([6, 10]);
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 3;
        ctx.strokeText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
        ctx.setLineDash([]);
    }, [currentLetter]);

    const getPos = (e: React.TouchEvent | React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
        }
        return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
    };

    const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
        isDrawingRef.current = true;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDrawingRef.current) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineWidth = 22;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#34d399';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        const key = `${Math.round(pos.x / 8)},${Math.round(pos.y / 8)}`;
        setCoveredPoints((prev) => new Set(prev).add(key));
    };

    const stopDraw = () => { isDrawingRef.current = false; };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCoveredPoints(new Set());
        if (currentLetter) {
            const size = Math.min(canvas.width, canvas.height) * 0.7;
            ctx.font = `${size}px Amiri, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#10b981';
            ctx.fillText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
            ctx.globalAlpha = 1;
            ctx.setLineDash([6, 10]);
            ctx.strokeStyle = '#6ee7b7';
            ctx.lineWidth = 3;
            ctx.strokeText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
            ctx.setLineDash([]);
        }
    };

    const handleNext = () => {
        const coverage = Math.min(100, (coveredPoints.size / 50) * 100);
        const gained = coverage >= 30 ? Math.round(100 / TOTAL_LETTERS) : 0;
        setScore((prev) => Math.min(100, prev + gained));

        if (currentIdx + 1 >= TOTAL_LETTERS) {
            setIsFinished(true);
            if (student) {
                const finalScore = Math.min(100, score + gained);
                axios.post('/game/score', {
                    student_id: student.id, level_id: level.id, score: finalScore,
                    total_questions: TOTAL_LETTERS, correct_answers: TOTAL_LETTERS,
                    duration_seconds: Math.round((Date.now() - startTime.current) / 1000),
                }).catch(console.error);
            }
        } else {
            setShowSuccess(true);
            setTimeout(() => { setShowSuccess(false); setCurrentIdx((prev) => prev + 1); }, 1000);
        }
    };

    const restart = () => {
        const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, TOTAL_LETTERS);
        setQueue(shuffled); setCurrentIdx(0); setScore(0); setIsFinished(false); startTime.current = Date.now();
    };

    // ── Result Screen ──
    if (isFinished) {
        const stars = score >= 80 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
        return (
            <div className="h-screen-safe overflow-auto bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 pt-8"
                style={{ backgroundImage: "url('/images/background%20level.png')" }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' as const, damping: 18 }}
                    className="w-full max-w-sm bg-white/95 backdrop-blur-md border-4 border-amber-300 rounded-[28px] p-5 shadow-2xl flex flex-col items-center gap-3 mt-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 px-6 py-2 rounded-full font-black text-lg -mt-10 uppercase"
                        style={{ boxShadow: '0 4px 0 #b45309' }}>
                        Selesai!
                    </div>
                    <Trophy size={40} className="text-amber-500" />
                    <h2 className="text-xl font-black text-slate-800 text-center">Selesai Menebalkan!</h2>
                    <p className="text-slate-500 text-xs text-center">Kamu telah menebalkan {TOTAL_LETTERS} huruf hijaiyah</p>
                    <div className="text-5xl font-black text-amber-500">{score}</div>
                    <div className="flex gap-1">{[1,2,3].map(i => (
                        <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: i <= stars ? 1 : 0.6 }}
                            transition={{ delay: i * 0.2, type: 'spring' as const }}
                            className={`text-4xl ${i <= stars ? 'text-amber-400' : 'text-slate-200'}`}>★</motion.span>
                    ))}</div>
                    <div className="w-full flex gap-2">
                        <button onClick={() => router.visit(`/game/select${student ? `?student_id=${student.id}` : ''}`)}
                            className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-sm">
                            <ArrowLeft size={16} /> Kembali
                        </button>
                        <button onClick={restart}
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-sm shadow-lg">
                            <RotateCcw size={16} /> Main Lagi
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Game Screen ──
    return (
        <div className="h-screen-safe overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col font-sans relative"
            style={{ backgroundImage: "url('/images/background%20level.png')" }}>

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
                            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                                animate={{ width: `${((currentIdx) / TOTAL_LETTERS) * 100}%` }} transition={{ duration: 0.4 }} />
                        </div>
                        <span className="text-[9px] font-black text-slate-500">{currentIdx + 1}/{TOTAL_LETTERS}</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm font-black text-[10px]">
                    ✏️ {currentIdx + 1}/{TOTAL_LETTERS}
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 min-h-0 flex flex-row items-stretch max-w-5xl mx-auto w-full px-3 gap-3 z-10 pb-2">

                {/* Letter Info Card — Left */}
                {currentLetter && (
                    <div className="w-[30%] flex flex-col items-center justify-center gap-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-[9px] sm:text-xs font-black shadow-lg border-2 border-white/50 whitespace-nowrap">
                            Tebalkan huruf:
                        </div>
                        <div className="bg-white/95 backdrop-blur-md border-[3px] border-white rounded-[20px] p-3 sm:p-4 text-center shadow-xl relative w-full">
                            <div className="text-5xl sm:text-6xl font-arabic text-indigo-900 mb-1 leading-none drop-shadow-sm">{currentLetter.char_arabic}</div>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-indigo-600 font-extrabold text-[10px] sm:text-xs">"{currentLetter.name}" — "{currentLetter.read_latin}"</p>
                                <button onClick={() => playAudio(currentLetter.char_arabic)}
                                    className="bg-indigo-500 text-white p-1.5 rounded-full hover:bg-indigo-600 transition-colors active:scale-90 shadow-md">
                                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Buttons under the letter card */}
                        <div className="flex gap-1.5 w-full">
                            <button onClick={clearCanvas}
                                className="flex-1 flex items-center justify-center gap-1 bg-white border-2 border-slate-200 text-slate-600 px-2 py-1.5 rounded-xl font-extrabold text-[10px] sm:text-xs transition-all active:scale-95 shadow-sm hover:bg-slate-50">
                                <Eraser className="w-3 h-3" /> Hapus
                            </button>
                            <button onClick={handleNext}
                                className="flex-[2] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1.5 rounded-xl font-black text-[10px] sm:text-xs shadow-lg transition-all active:scale-95 hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center gap-1 border-2 border-indigo-300/50">
                                <CheckCircle2 className="w-3 h-3" />
                                {currentIdx + 1 >= TOTAL_LETTERS ? 'Selesai! 🎉' : 'Lanjut →'}
                            </button>
                        </div>

                        {/* Success/Hint bar */}
                        <AnimatePresence mode="wait">
                            {showSuccess ? (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                    className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black py-1.5 rounded-full px-3 shadow-sm w-full">
                                    ✅ Bagus! Lanjut!
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 text-[10px] font-bold text-amber-700 w-full">
                                    <Trophy className="w-3 h-3 text-amber-500" /> Semangat!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Canvas Area — Right */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-full h-full rounded-[20px] overflow-hidden border-4 border-dashed border-indigo-200 bg-white shadow-md flex flex-col justify-center items-center">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full text-[9px] font-extrabold border border-indigo-200 whitespace-nowrap">
                                ✏️ Ikuti garis putus-putus
                            </div>
                        </div>
                        <canvas ref={canvasRef} width={600} height={400}
                            className="w-full h-full touch-none cursor-crosshair object-contain"
                            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
