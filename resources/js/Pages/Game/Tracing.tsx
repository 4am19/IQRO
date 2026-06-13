import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { useAudioPlayer } from '@/Hooks/useAudioPlayer';
import { Trophy, RotateCcw, ArrowLeft, Eraser, CheckCircle2, Volume2, X, SkipForward } from 'lucide-react';
import axios from 'axios';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';

interface Letter { id: number; char_arabic: string; name: string; read_latin: string; }
interface Level { id: number; title: string; minimum_passing_score: number; }
interface Student { id: number; name: string; }
interface TracingProps { letters: Letter[]; level: Level; student?: Student | null; nextLevel?: Level | null; }

const TOTAL_LETTERS = 5;
const MIN_COVERAGE = 0.05;   // Very relaxed: just 5% coverage means they traced inside the line

/* ═══════════════════════════════════════════════════════════════════════════
   ENCOURAGEMENT MESSAGES
   ═══════════════════════════════════════════════════════════════════════════ */
const ERROR_MESSAGES = [
    'Ayo tulis hurufnya dulu! ✏️',
    'Ikuti garis putus-putusnya ya! 🌟',
];
const SUCCESS_MESSAGES = [
    'Bagus sekali! 🌟',
    'MasyaAllah, hebat! 🎉',
    'Kamu pintar! ⭐',
    'Sempurna! 💯',
];

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED START POINT COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN TRACING COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Tracing({ letters, level, student, nextLevel }: TracingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const guideCanvasRef = useRef<HTMLCanvasElement>(null); // Hidden canvas for guide pixel detection
    const isDrawingRef = useRef(false);
    const { playAudio } = useAudioPlayer();

    const [queue, setQueue] = useState<Letter[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showGuidePoints, setShowGuidePoints] = useState(true);
    const startTime = useRef(Date.now());

    // Validation state
    const [corePixels, setCorePixels] = useState<Set<string>>(new Set());
    const [validPixels, setValidPixels] = useState<Set<string>>(new Set());
    const [letterBounds, setLetterBounds] = useState<{minX: number, maxX: number, minY: number, maxY: number} | null>(null);
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('');
    const [shakeButton, setShakeButton] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // Initialize letter queue
    useEffect(() => {
        if (letters.length === 0) return;
        const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, TOTAL_LETTERS);
        setQueue(shuffled);
        setCurrentIdx(0);
        setScore(0);
        setIsFinished(false);
        setShowGuidePoints(true);
        startTime.current = Date.now();
    }, [letters]);

    const currentLetter = queue[currentIdx] ?? null;

    // Render guide letter on both visible canvas and hidden guide canvas
    const renderGuide = useCallback(() => {
        if (!currentLetter) return;
        const canvas = canvasRef.current;
        const guideCanvas = guideCanvasRef.current;
        if (!canvas || !guideCanvas) return;

        const ctx = canvas.getContext('2d');
        const guideCtx = guideCanvas.getContext('2d');
        if (!ctx || !guideCtx) return;

        // Set hidden guide canvas to same size
        guideCanvas.width = canvas.width;
        guideCanvas.height = canvas.height;

        // Clear both
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);

        const size = Math.min(canvas.width, canvas.height) * 0.7;

        // Draw on guide canvas (solid, thick — for generous pixel detection area)
        guideCtx.font = `${size}px Amiri, serif`;
        guideCtx.textAlign = 'center';
        guideCtx.textBaseline = 'middle';
        guideCtx.fillStyle = '#000000';
        guideCtx.fillText(currentLetter.char_arabic, guideCanvas.width / 2, guideCanvas.height / 2);

        // 1. Get the visual bounding box of the letter using measureText
        // This avoids the bloat from the thick line stroke and gives exact visual extremes
        const metrics = guideCtx.measureText(currentLetter.char_arabic);
        const minX = (guideCanvas.width / 2) - metrics.actualBoundingBoxLeft;
        const maxX = (guideCanvas.width / 2) + metrics.actualBoundingBoxRight;
        const minY = (guideCanvas.height / 2) - metrics.actualBoundingBoxAscent;
        const maxY = (guideCanvas.height / 2) + metrics.actualBoundingBoxDescent;

        // Save true visual bounding box for stroke mapping
        if (minX <= maxX && minY <= maxY) {
            setLetterBounds({ minX, maxX, minY, maxY });
        } else {
            setLetterBounds(null);
        }

        // 2. Extract core skeleton pixels (thin) for coverage validation
        let imageData = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height);
        const newCorePixels = new Set<string>();
        const gridSize = 6;
        
        for (let y = 0; y < guideCanvas.height; y += gridSize) {
            for (let x = 0; x < guideCanvas.width; x += gridSize) {
                const idx = (y * guideCanvas.width + x) * 4;
                if (imageData.data[idx + 3] > 30) { 
                    newCorePixels.add(`${Math.round(x / gridSize)},${Math.round(y / gridSize)}`);
                }
            }
        }
        setCorePixels(newCorePixels);

        // 3. Draw fat stroke for valid tracing area boundaries
        guideCtx.lineWidth = 40; // FAT stroke for generous detection area
        guideCtx.strokeStyle = '#000000';
        guideCtx.strokeText(currentLetter.char_arabic, guideCanvas.width / 2, guideCanvas.height / 2);

        // 4. Extract valid pixels for accuracy validation
        imageData = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height);
        const newValidPixels = new Set<string>();
        for (let y = 0; y < guideCanvas.height; y += gridSize) {
            for (let x = 0; x < guideCanvas.width; x += gridSize) {
                const idx = (y * guideCanvas.width + x) * 4;
                if (imageData.data[idx + 3] > 30) { 
                    newValidPixels.add(`${Math.round(x / gridSize)},${Math.round(y / gridSize)}`);
                }
            }
        }
        setValidPixels(newValidPixels);

        // Draw on visible canvas (ghost + dashed outline)
        ctx.font = `${size}px Amiri, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#10b981';
        ctx.fillText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
        ctx.globalAlpha = 1;
        ctx.setLineDash([6, 10]);
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 4;
        ctx.strokeText(currentLetter.char_arabic, canvas.width / 2, canvas.height / 2);
        ctx.setLineDash([]);
    }, [currentLetter]);

    // Handle resize to match canvas internal resolution with CSS display size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver(() => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                    if (guideCanvasRef.current) {
                        guideCanvasRef.current.width = rect.width;
                        guideCanvasRef.current.height = rect.height;
                    }
                    if (currentLetter) {
                        requestAnimationFrame(() => renderGuide());
                    }
                }
            }
        });

        observer.observe(canvas);
        return () => observer.disconnect();
    }, [currentLetter, renderGuide]);

    // When current letter changes, reset everything and render guide
    useEffect(() => {
        if (!currentLetter) return;
        setFeedbackMsg('');
        setFeedbackType('');
        setHasDrawn(false);
        // Small delay to ensure canvas is ready before render
        setTimeout(() => requestAnimationFrame(() => renderGuide()), 50);
    }, [currentLetter, renderGuide]);

    // ── Drawing Handlers ──
    const getPos = (e: React.TouchEvent | React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = 0;
        let clientY = 0;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        
        return { 
            x: (clientX - rect.left) * scaleX, 
            y: (clientY - rect.top) * scaleY 
        };
    };

    const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
        isDrawingRef.current = true;
        setHasDrawn(true);
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

        const gridSize = 6;
        const key = `${Math.round(pos.x / gridSize)},${Math.round(pos.y / gridSize)}`;
        const isOnGuide = validPixels.has(key);

        ctx.lineWidth = 32; 
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = isOnGuide ? '#34d399' : 'rgba(239, 68, 68, 0.4)'; 
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const stopDraw = () => { isDrawingRef.current = false; };

    // ── Clear Canvas ──
    const clearCanvas = () => {
        setFeedbackMsg('');
        setFeedbackType('');
        setHasDrawn(false);
        renderGuide();
    };

    // ── Calculate coverage and accuracy using actual pixel data ──
    const getStats = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return { coverage: 0, accuracy: 0, minChunkCoverage: 0 };

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return { coverage: 0, accuracy: 0, minChunkCoverage: 0 };

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        let totalDrawnPixels = 0;
        let drawnOnCorePixels = 0;
        let drawnOnValidPixels = 0;
        const gridSize = 6;
        
        // Chunk-based coverage to detect missed dots or detached letter parts
        const chunkSize = 60; 
        const chunks = new Map<string, { total: number, drawn: number }>();
        
        for (const key of corePixels) {
            const [gx, gy] = key.split(',').map(Number);
            const px = gx * gridSize;
            const py = gy * gridSize;
            const chunkKey = `${Math.floor(px / chunkSize)},${Math.floor(py / chunkSize)}`;
            if (!chunks.has(chunkKey)) chunks.set(chunkKey, { total: 0, drawn: 0 });
            chunks.get(chunkKey)!.total++;
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
            for (let x = 0; x < canvas.width; x += gridSize) {
                const idx = (y * canvas.width + x) * 4;
                if (data[idx + 3] > 50) {
                    totalDrawnPixels++;
                    const key = `${Math.round(x / gridSize)},${Math.round(y / gridSize)}`;
                    
                    if (corePixels.has(key)) {
                        drawnOnCorePixels++;
                        const chunkKey = `${Math.floor(x / chunkSize)},${Math.floor(y / chunkSize)}`;
                        if (chunks.has(chunkKey)) {
                            chunks.get(chunkKey)!.drawn++;
                        }
                    }
                    if (validPixels.has(key)) {
                        drawnOnValidPixels++;
                    }
                }
            }
        }

        const coverage = corePixels.size > 0 ? drawnOnCorePixels / corePixels.size : 0;
        const accuracy = totalDrawnPixels > 0 ? drawnOnValidPixels / totalDrawnPixels : 0;

        let minChunkCoverage = 1.0;
        for (const chunk of chunks.values()) {
            if (chunk.total > 5) { // Ignore tiny anti-aliasing artifacts
                const cov = chunk.drawn / chunk.total;
                if (cov < minChunkCoverage) minChunkCoverage = cov;
            }
        }

        return { coverage, accuracy, minChunkCoverage };
    }, [corePixels, validPixels]);

    // ── Handle Next / Submit ──
    const handleNext = () => {
        if (!hasDrawn) {
            setFeedbackMsg('Ayo tulis hurufnya dulu! ✏️');
            setFeedbackType('error');
            setShakeButton(true);
            setTimeout(() => setShakeButton(false), 500);
            return;
        }

        const { coverage, accuracy, minChunkCoverage } = getStats();
        // Must cover 50% overall, AND at least 40% of every single 60x60 region of the letter
        const passed = coverage >= 0.50 && minChunkCoverage >= 0.40 && accuracy >= 0.98;

        if (!passed) {
            let msg = 'Coba tebalkan lagi yang rapi ya! ✏️';
            if (accuracy < 0.98) msg = 'Coretannya ada yang keluar batas (warna merah)! ✏️';
            else if (minChunkCoverage < 0.40) msg = 'Ada bagian huruf atau titik yang terlewat! 🔍';
            else if (coverage < 0.50) msg = 'Garis putus-putusnya belum ditebalkan semua! 🔍';
                
            setFeedbackMsg(msg);
            setFeedbackType('error');
            setShakeButton(true);
            setTimeout(() => setShakeButton(false), 500);
            return;
        }

        const gained = passed ? Math.round(100 / TOTAL_LETTERS) : Math.round((100 / TOTAL_LETTERS) * 0.3);
        const successMsg = passed
            ? SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
            : 'Tidak apa-apa, ayo lanjut! 💪';
        setFeedbackMsg(successMsg);
        setFeedbackType('success');
        setScore(prev => Math.min(100, prev + gained));

        if (currentIdx + 1 >= TOTAL_LETTERS) {
            setTimeout(() => {
                setIsFinished(true);
                if (student) {
                    const finalScore = Math.min(100, score + gained);
                    axios.post('/game/score', {
                        student_id: student.id, level_id: level.id, score: finalScore,
                        total_questions: TOTAL_LETTERS, correct_answers: TOTAL_LETTERS,
                        duration_seconds: Math.round((Date.now() - startTime.current) / 1000),
                    }).catch(console.error);
                }
            }, 1200);
        } else {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setCurrentIdx(prev => prev + 1);
            }, 1200);
        }
    };

    const restart = () => {
        const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, TOTAL_LETTERS);
        setQueue(shuffled);
        setCurrentIdx(0);
        setScore(0);
        setIsFinished(false);
        setShowGuidePoints(true);
        startTime.current = Date.now();
    };

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
                            className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm">
                            <ArrowLeft size={16} /> Kembali
                        </button>
                        
                        <button onClick={restart}
                            className={`flex-1 font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm shadow-sm border-2 ${
                                (nextLevel && score >= level.minimum_passing_score)
                                ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg'
                            }`}>
                            <RotateCcw size={16} /> { (nextLevel && score >= level.minimum_passing_score) ? 'Ulangi' : 'Main Lagi' }
                        </button>

                        {nextLevel && score >= level.minimum_passing_score && (
                            <button onClick={() => router.visit(`/game/play/${nextLevel.id}${student ? `?student_id=${student.id}` : ''}`)}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition-transform text-xs sm:text-sm shadow-lg border-2 border-transparent">
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
    return (
        <FullscreenWrapper>
        <div className="h-screen-safe overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col font-sans relative"
            style={{ backgroundImage: "url('/images/background%20level.png')" }}>

            <canvas ref={guideCanvasRef} width={600} height={400} className="hidden" />

            <div className="shrink-0 z-30 px-3 py-2 flex justify-between items-center w-full max-w-6xl mx-auto">
                <button onClick={() => router.visit(`/game/select?student_id=${student?.id ?? ''}`)}
                    className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-indigo-700 font-extrabold text-xs sm:text-sm hover:bg-white shadow-sm transition active:scale-95">
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> Keluar
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-white/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="text-amber-500 text-sm">⭐</span>
                        <span className="text-[10px] sm:text-xs font-black text-slate-700">Skor: {score}</span>
                    </div>
                    <div className="w-24 sm:w-32 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                                animate={{ width: `${((currentIdx) / TOTAL_LETTERS) * 100}%` }} transition={{ duration: 0.4 }} />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-500">{currentIdx + 1}/{TOTAL_LETTERS}</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-sm font-black text-[10px] sm:text-xs">
                    ✏️ {currentIdx + 1}/{TOTAL_LETTERS}
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col md:flex-row items-center md:items-stretch max-w-6xl mx-auto w-full px-3 sm:px-8 gap-3 sm:gap-4 md:gap-10 z-10 pb-3 md:pb-6 pt-1">

                {currentLetter && (
                    <div className="w-full md:w-[35%] flex flex-col items-center justify-center gap-2 md:gap-4 max-w-sm md:max-w-md mx-auto">
                        <div className="bg-white/95 backdrop-blur-md border-4 border-white rounded-[24px] md:rounded-[28px] p-4 sm:p-5 md:p-8 text-center shadow-2xl relative w-full flex flex-col items-center">
                            <div className="text-5xl sm:text-6xl md:text-8xl font-arabic font-black text-indigo-900 mb-2 md:mb-3 leading-none drop-shadow-sm">{currentLetter.char_arabic}</div>
                            <div className="flex items-center justify-center gap-2 md:gap-3 bg-indigo-50 px-3 md:px-6 py-2 md:py-3 rounded-full border border-indigo-100 shadow-sm w-full mt-1 md:mt-2">
                                <p className="text-indigo-700 font-black text-[10px] sm:text-xs md:text-base flex-1 text-center whitespace-nowrap">"{currentLetter.name}" — "{currentLetter.read_latin}"</p>
                                <button onClick={() => playAudio(currentLetter.char_arabic, currentLetter.char_arabic)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-1.5 md:p-2.5 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-colors active:scale-90 shadow-md">
                                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full mt-1">
                            <button onClick={clearCanvas}
                                className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-white border-2 md:border-4 border-slate-200 text-slate-600 px-2 sm:px-4 py-2 sm:py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] sm:text-sm md:text-lg transition-all active:scale-95 shadow-md hover:bg-slate-50">
                                <Eraser className="w-3 h-3 md:w-5 md:h-5" /> Hapus
                            </button>
                            <motion.button
                                onClick={handleNext}
                                animate={shakeButton ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className={`flex-[1.5] px-2 sm:px-4 py-2 sm:py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] sm:text-sm md:text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-2 border-2 md:border-4 ${
                                    hasDrawn
                                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white hover:from-emerald-500 hover:to-green-600 border-emerald-300/50'
                                        : 'bg-slate-200 text-slate-400 border-slate-300/50 cursor-not-allowed'
                                }`}
                            >
                                <CheckCircle2 className="w-3 h-3 md:w-5 md:h-5 shrink-0" />
                                <span className="truncate">{currentIdx + 1 >= TOTAL_LETTERS ? 'Selesai! 🎉' : 'Lanjut →'}</span>
                            </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                            {feedbackType === 'error' ? (
                                <motion.div key="error"
                                    initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                    className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border-2 md:border-4 border-rose-200 text-[10px] sm:text-xs md:text-sm font-black py-2 md:py-2.5 rounded-full px-4 shadow-sm w-full">
                                    {feedbackMsg}
                                </motion.div>
                            ) : feedbackType === 'success' || showSuccess ? (
                                <motion.div key="success"
                                    initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                    className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border-2 md:border-4 border-emerald-200 text-[10px] sm:text-xs md:text-sm font-black py-2 md:py-2.5 rounded-full px-4 shadow-sm w-full">
                                    {feedbackMsg || '✅ Bagus! Lanjut!'}
                                </motion.div>
                            ) : (
                                <motion.div key="hint"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-1.5 md:gap-2 bg-white/80 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border md:border-2 border-white/50 text-[10px] sm:text-xs md:text-sm font-black text-amber-700 w-full">
                                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-500" />
                                    <span>Tebalkan garisnya! ✏️</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="w-full md:w-[60%] flex-1 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px] md:min-h-0 relative">
                    <div className="mb-2 md:mb-3 bg-indigo-100 text-indigo-700 px-4 md:px-5 py-1 md:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-black border-2 border-indigo-200 whitespace-nowrap shadow-sm z-20">
                        ✏️ Ikuti garis putus-putus
                    </div>

                    <div className="relative w-full h-full rounded-[20px] md:rounded-[28px] overflow-hidden border-[4px] md:border-[6px] border-dashed border-indigo-200 bg-white shadow-xl flex flex-col justify-center items-center">

                        <canvas ref={canvasRef}
                            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
                            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                        />
                    </div>
                </div>
            </div>
        </div>
        </FullscreenWrapper>
    );
}
