import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';
import {
    DndContext, DragEndEvent, useDroppable, useDraggable,
    TouchSensor, MouseSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { Trophy, RotateCcw, ArrowLeft, CheckCircle2, Volume2, X, Sparkles, SkipForward } from 'lucide-react';
import axios from 'axios';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';

interface Letter { id: number; char_arabic: string; name: string; read_latin: string; }
interface Level { id: number; title: string; minimum_passing_score: number; }
interface Student { id: number; name: string; }
interface DragDropProps { letters: Letter[]; level: Level; student?: Student | null; nextLevel?: Level | null; }

const WORD_LIST = [
    { word: 'بَيْت', meaning: 'Rumah',  letters: ['ب', 'ي', 'ت'] },
    { word: 'كِتَاب', meaning: 'Buku',  letters: ['ك', 'ت', 'ا', 'ب'] },
    { word: 'بَاب',  meaning: 'Pintu',  letters: ['ب', 'ا', 'ب'] },
    { word: 'نَار',  meaning: 'Api',    letters: ['ن', 'ا', 'ر'] },
    { word: 'سَمَاء', meaning: 'Langit', letters: ['س', 'م', 'ا', 'ء'] },
];

// Confetti particle component
function ConfettiParticles() {
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
}

function DraggableLetter({ id, char, isPlaced, borderClass }: { id: string; char: string; isPlaced: boolean; borderClass?: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    if (isPlaced) return <div className="w-14 h-14 md:w-20 md:h-20 opacity-0 rounded-2xl" />;
    return (
        <div ref={setNodeRef} {...listeners} {...attributes}
            className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-white border-4 ${borderClass || 'border-indigo-200'} rounded-2xl md:rounded-3xl font-arabic text-3xl md:text-5xl cursor-grab active:cursor-grabbing transition-all touch-none shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 ${isDragging ? 'opacity-30' : ''}`}>
            {char}
        </div>
    );
}

function DroppableSlot({ id, char }: { id: string; char?: string }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef}
            className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-2xl md:rounded-3xl border-[3px] md:border-4 transition-all ${
                char ? 'bg-indigo-50 border-indigo-400 text-3xl md:text-5xl font-arabic shadow-sm text-indigo-900'
                : isOver ? 'bg-indigo-50 border-indigo-300 border-dashed scale-105'
                : 'bg-white border-dashed border-slate-300 shadow-inner'
            }`}>
            {char || <span className="text-slate-300 text-sm md:text-base font-black">?</span>}
        </div>
    );
}

export default function DragDrop({ letters, level, student, nextLevel }: DragDropProps) {
    const { playAudio } = useAudioPlayer();
    const [wordQueue] = useState(() => [...WORD_LIST].sort(() => Math.random() - 0.5));
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [slots, setSlots] = useState<(string | null)[]>([]);
    const [shuffledLetters, setShuffledLetters] = useState<{ id: string; char: string }[]>([]);
    const [placedMap, setPlacedMap] = useState<Record<string, string | null>>({});
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const startTime = useRef(Date.now());

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
    );

    const currentWord = wordQueue[currentWordIdx];

    useEffect(() => {
        if (!currentWord) return;
        setSlots(new Array(currentWord.letters.length).fill(null));
        setShuffledLetters([...currentWord.letters].sort(() => Math.random() - 0.5).map((char, i) => ({ id: `letter-${i}-${char}`, char })));
        setPlacedMap({});
        setFeedback(null);
    }, [currentWordIdx]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        const droppedChar = shuffledLetters.find(l => l.id === active.id)?.char;
        const slotIdx = parseInt(over.id as string);
        if (!droppedChar || isNaN(slotIdx)) return;
        setSlots(prev => { const next = [...prev]; next[slotIdx] = droppedChar; return next; });
        setPlacedMap(prev => ({ ...prev, [active.id as string]: over.id as string }));
    };

    const checkAnswer = () => {
        const isCorrect = slots.every((char, idx) => char === currentWord.letters[idx]);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) {
            setScore(prev => Math.min(100, prev + Math.round(100 / wordQueue.length)));
            playAudio(currentWord.word);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        } else {
            setWrongAnswers(prev => [...prev, currentWord.word]);
        }
        setTimeout(() => {
            if (currentWordIdx + 1 >= wordQueue.length) {
                setIsFinished(true);
                if (student) {
                    const finalScore = Math.min(100, score + (isCorrect ? Math.round(100 / wordQueue.length) : 0));
                    axios.post('/game/score', {
                        student_id: student.id, level_id: level.id, score: finalScore,
                        total_questions: wordQueue.length, correct_answers: wordQueue.length,
                        duration_seconds: Math.round((Date.now() - startTime.current) / 1000),
                        wrong_answers: wrongAnswers,
                    }).catch(console.error);
                }
            } else {
                setCurrentWordIdx(prev => prev + 1);
            }
        }, 1500);
    };

    const restart = () => { setCurrentWordIdx(0); setScore(0); setIsFinished(false); setWrongAnswers([]); startTime.current = Date.now(); };

    const BORDER_COLORS = ['border-blue-400', 'border-green-400', 'border-orange-400', 'border-pink-400', 'border-purple-400'];

    // ── Result Screen ──
    if (isFinished) {
        const stars = score >= 80 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
        return (
            <FullscreenWrapper>
            <div className="h-screen-safe overflow-auto bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 pt-8"
                style={{ backgroundImage: "url('/images/background%20level.png')" }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' as const, damping: 18 }}
                    className="w-full max-w-sm bg-white/95 backdrop-blur-md border-4 border-amber-300 rounded-[28px] p-5 shadow-2xl flex flex-col items-center gap-3 mt-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 px-6 py-2 rounded-full font-black text-lg -mt-10 uppercase"
                        style={{ boxShadow: '0 4px 0 #b45309' }}>
                        Kata Tersusun!
                    </div>
                    <Trophy size={40} className="text-amber-500" />
                    <div className="text-5xl font-black text-amber-500">{score}</div>
                    <div className="flex gap-1">{[1,2,3].map(i => (
                        <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: i <= stars ? 1 : 0.6 }}
                            transition={{ delay: i * 0.2, type: 'spring' as const }}
                            className={`text-4xl ${i <= stars ? 'text-amber-400' : 'text-slate-200'}`}>★</motion.span>
                    ))}</div>
                        <div className="w-full flex gap-3 mt-2">
                            <button onClick={() => router.visit(`/game/select${student ? `?student_id=${student.id}` : ''}`)}
                                className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-black py-2.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs sm:text-sm shadow-sm hover:bg-slate-50">
                                <ArrowLeft size={16} /> Kembali
                            </button>
                            <button onClick={restart}
                                className={`flex-1 font-black py-2.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs sm:text-sm shadow-sm border-2 ${
                                    (nextLevel && score >= level.minimum_passing_score)
                                    ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                                    : 'bg-gradient-to-r from-orange-400 to-amber-500 text-white border-transparent shadow-lg'
                                }`}>
                                <RotateCcw size={16} /> {(nextLevel && score >= level.minimum_passing_score) ? 'Ulangi' : 'Main Lagi'}
                            </button>
                            {nextLevel && score >= level.minimum_passing_score && (
                                <button onClick={() => router.visit(`/game/play/${nextLevel.id}${student ? `?student_id=${student.id}` : ''}`)}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black py-2.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs sm:text-sm shadow-lg border-2 border-transparent">
                                    Lanjut <SkipForward size={16} />
                                </button>
                            )}
                        </div>
                </motion.div>
            </div>
            </FullscreenWrapper>
        );
    }

    // ── Game Screen ──
    const pct = (currentWordIdx / wordQueue.length) * 100;

    return (
        <FullscreenWrapper>
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
                        <span className="text-[9px] font-black text-slate-500">{currentWordIdx + 1}/{wordQueue.length}</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm font-black text-[10px]">
                    🔤 {currentWordIdx + 1}/{wordQueue.length}
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 min-h-0 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto w-full px-4 sm:px-8 gap-6 md:gap-12 z-10 py-6 md:py-0">

                {/* Word Target Card — Top/Left */}
                <div className="w-full md:w-[40%] flex flex-col items-center justify-center gap-3 md:gap-4 max-w-sm md:max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-lg border-2 border-white/50 whitespace-nowrap">
                        ✨ Susun huruf untuk membentuk kata ✨
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border-4 border-white rounded-[28px] p-5 sm:p-8 text-center shadow-2xl relative w-full flex flex-col items-center">
                        <div className="text-6xl md:text-8xl font-arabic font-black text-indigo-900 mb-3 md:mb-5 drop-shadow-sm leading-tight">{currentWord?.word}</div>
                        <div className="flex items-center justify-center gap-3 bg-indigo-50 px-4 md:px-6 py-2 md:py-3 rounded-full border border-indigo-100 shadow-sm w-full mt-2">
                            <p className="text-indigo-700 font-black text-sm md:text-base flex-1 text-center">"{currentWord?.meaning}"</p>
                            <button onClick={() => playAudio(currentWord?.word ?? '')}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 md:p-2.5 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-colors active:scale-90 shadow-md">
                                <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Drag-Drop Area — Bottom/Right */}
                <div className="w-full md:w-[50%] flex flex-col gap-4 md:gap-6 max-w-md md:max-w-xl mx-auto">
                    <DndContext sensors={sensors} onDragStart={({ active }) => setActiveId(active.id as string)} onDragEnd={handleDragEnd}>
                        {/* Drop Slots */}
                        <div className="bg-white/80 backdrop-blur-md border-4 border-dashed border-indigo-200 rounded-[28px] p-4 sm:p-6 md:p-8 flex flex-row-reverse justify-center gap-3 md:gap-5 shadow-inner min-h-[100px] md:min-h-[140px] items-center">
                            {slots.map((char, idx) => (
                                <DroppableSlot key={idx} id={String(idx)} char={char ?? undefined} />
                            ))}
                        </div>

                        {/* Draggable Letters */}
                        <div className="bg-white/95 backdrop-blur-md border-4 border-white rounded-[28px] p-5 sm:p-6 md:p-8 shadow-2xl relative">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-50 text-indigo-700 px-5 py-1.5 rounded-full text-xs md:text-sm font-black border-2 border-indigo-200 whitespace-nowrap shadow-sm">
                                Seret huruf ke kotak di atas 👆
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 md:gap-5 pt-3">
                                {shuffledLetters.map((letter, idx) => {
                                    const isPlaced = !!placedMap[letter.id];
                                    const borderClass = BORDER_COLORS[idx % BORDER_COLORS.length];
                                    return (
                                        <div key={letter.id} className="relative">
                                            <DraggableLetter id={letter.id} char={letter.char} isPlaced={isPlaced} borderClass={borderClass} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                            {activeId ? (() => {
                                const letter = shuffledLetters.find(l => l.id === activeId);
                                const idx = shuffledLetters.findIndex(l => l.id === activeId);
                                const borderClass = BORDER_COLORS[idx % BORDER_COLORS.length] || BORDER_COLORS[0];
                                return (
                                    <div className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-white border-4 ${borderClass} rounded-2xl md:rounded-3xl font-arabic text-3xl md:text-5xl shadow-2xl scale-110`}>
                                        {letter?.char}
                                    </div>
                                );
                            })() : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Check / Feedback */}
                    <div className="mt-1 md:mt-2">
                        {!feedback ? (
                            <button onClick={checkAnswer} disabled={slots.some(s => s === null)}
                                className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black text-sm md:text-lg py-3 md:py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-[3px] border-emerald-300/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> Cek Jawaban
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className={`w-full flex items-center justify-center gap-2 text-sm md:text-base font-black py-3 md:py-4 rounded-full shadow-md border-4
                                    ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                                {feedback === 'correct' ? (
                                    <><Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400" /> Benar! Keren sekali!</>
                                ) : '💡 Hmm, susunannya belum pas. Coba lagi yuk!'}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </FullscreenWrapper>
    );
}
