import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Lock, Star, Check, User, Plus } from 'lucide-react';
import MascotHufi from '@/Components/MascotHufi';

interface Level { id: number; title: string; description: string; order_sequence: number; minimum_passing_score: number; }
interface Student { id: number; name: string; avatar_url?: string; }
interface Props {
    levels: Level[];
    student?: Student | null;
    students?: Student[];
    progress?: Record<number, { is_completed: boolean; highest_score: number }>;
    auth: { user: { name: string; students?: Student[] } | null };
    totalStars?: number;
}

export default function GameSelect({ levels, student, students = [], progress = {}, auth, totalStars = 0 }: Props) {
    // Auto-select first student if none selected but available
    const selectedStudent = student ?? (students.length > 0 ? students[0] : null);
    const [showDropdown, setShowDropdown] = useState(false);

    const sorted = [...levels].sort((a, b) => a.order_sequence - b.order_sequence);

    const isLocked = (l: Level) => {
        // If guest (not logged in), ALL levels are unlocked so they can try the game!
        if (!auth.user) return false;

        if (l.order_sequence === 1) return false;
        const prev = levels.find(x => x.order_sequence === l.order_sequence - 1);
        return !prev || !progress[prev.id]?.is_completed;
    };

    const handlePlay = (levelId: number, locked: boolean) => {
        if (locked) return;
        
        // If logged in but no student selected, prompt them.
        if (auth.user && !selectedStudent) {
            alert('Mohon pilih akun terlebih dahulu!');
            return;
        }

        // If guest (!auth.user), we just pass without student_id
        const query = selectedStudent ? `?student_id=${selectedStudent.id}` : '';
        router.visit(`/game/play/${levelId}${query}`);
    };

    const selectAccount = (s: Student) => {
        setShowDropdown(false);
        router.get('/game/select', { student_id: s.id }, { preserveState: true, preserveScroll: true });
    };

    // Ensure exactly 4 levels for the map layout
    const paddedLevels = [...sorted];
    while (paddedLevels.length < 4) {
        paddedLevels.push({
            id: -paddedLevels.length,
            title: `Level ${paddedLevels.length + 1}`,
            description: 'Akan datang',
            order_sequence: paddedLevels.length + 1,
            minimum_passing_score: 80,
            is_dummy: true
        } as any);
    }
    const displayLevels = paddedLevels.slice(0, 4);

    const renderNode = (level: any, idx: number, pos: { left: string; top: string }, mode: 'portrait' | 'landscape') => {
        const isDummy = level.is_dummy;
        const locked = isDummy ? true : isLocked(level);
        const prog = progress[level.id];
        const stars = prog?.highest_score ? (prog.highest_score >= 80 ? 3 : prog.highest_score >= 50 ? 2 : 1) : 0;
        const done = prog?.is_completed;

        const buildingAssets = [
            '/images/logo%20game%20iqro/01_Istana.png',
            '/images/logo%20game%20iqro/02_Masjid.png',
            '/images/logo%20game%20iqro/03_Rumah_Huruf.png',
            '/images/logo%20game%20iqro/04_Tajwid_Ujian_Akhir.png'
        ];
        const buildingImg = buildingAssets[idx];

        // Different sizes depending on mode
        const sizeClass = mode === 'landscape' 
            ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48' 
            : 'w-48 h-48 md:w-64 md:h-64';

        return (
            <div key={`${mode}-${level.id}`} className="absolute" style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}>
                <motion.button
                    id={`level-btn-${mode}-${level.id}`}
                    whileHover={!locked ? { scale: 1.15, y: -10 } : {}}
                    whileTap={!locked ? { scale: 0.95 } : {}}
                    onClick={() => !isDummy && handlePlay(level.id, locked)}
                    disabled={locked}
                    className={`relative flex flex-col items-center justify-center font-extrabold text-white transition-all duration-300 ${sizeClass} ${
                        locked ? 'opacity-80 grayscale hover:grayscale-[0.5]' : 'drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]'
                    } ${!locked && !done ? 'animate-[bounce_2.5s_infinite]' : ''}`}
                >
                    <img src={buildingImg} alt={`Level ${level.order_sequence}`} className="w-full h-full object-contain" />
                    
                    {/* Level Badge Overlay */}
                    <div className="absolute top-[8%] bg-gradient-to-b from-indigo-900 to-indigo-800 border-[3px] border-indigo-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-2xl flex flex-col items-center scale-75 sm:scale-100 origin-top">
                        <span className="text-[10px] sm:text-[12px] font-black text-indigo-200 uppercase tracking-widest leading-none mb-1">
                            Level {level.order_sequence}
                        </span>
                        <div className="flex items-center gap-1">
                            {locked ? <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" /> :
                             (done || stars > 0) ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 stroke-[3]" /> :
                             <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />}
                        </div>
                    </div>
                </motion.button>

                {/* Floating Stars */}
                {stars > 0 && (
                    <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 bg-black/70 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-md border-2 border-white/30 shadow-2xl scale-75 sm:scale-100 origin-bottom">
                        {[1,2,3].map(i => (
                            <span key={i} className={`text-sm sm:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${i <= stars ? 'text-amber-400' : 'text-white/20'}`}>★</span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout title="Peta Petualangan" fullWidth={true} noPadding={true} noHeader={true} noNav={true} customBg="/images/logo%20game%20iqro/00_background_game.png">
            <div className="relative w-full flex flex-col h-screen-safe overflow-hidden">
                
                {/* Header Overlay (Floating UI) */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 flex flex-col landscape:flex-row justify-between items-start landscape:items-center pointer-events-none gap-2 sm:gap-4">
                    
                    <div className="flex items-center gap-2 pointer-events-auto">
                        {/* Back Button */}
                        <button onClick={() => router.visit('/')} className="bg-white/80 backdrop-blur-md p-2 sm:p-3 rounded-full border-[3px] border-white shadow-xl hover:scale-105 transition-transform">
                            <span className="text-xl sm:text-2xl font-black text-indigo-600">🏠</span>
                        </button>

                        <div className="bg-white/80 backdrop-blur-md p-1.5 sm:p-2 pr-4 sm:pr-6 rounded-full border-[3px] border-white shadow-xl flex items-center gap-2 sm:gap-3 pointer-events-auto scale-90 sm:scale-100 origin-left">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-3xl shadow-inner border-[3px] border-white shrink-0 ${selectedStudent?.avatar_url === 'boy' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>
                                {selectedStudent ? (selectedStudent.avatar_url === 'boy' ? '👦' : '👧') : (!auth.user ? '👽' : '👤')}
                            </div>
                            <div>
                                <h1 className="font-black text-indigo-950 text-sm sm:text-lg leading-tight line-clamp-1">
                                    {selectedStudent ? selectedStudent.name : (!auth.user ? 'Tamu' : 'Pilih Akun')}
                                </h1>
                                <p className="text-[10px] sm:text-sm text-indigo-800 font-bold hidden sm:block">Ayo berpetualang!</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-row landscape:flex-row gap-2 sm:gap-3 items-center landscape:items-center pointer-events-auto scale-90 sm:scale-100 origin-right">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 border-[3px] sm:border-[4px] border-white px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform cursor-pointer shrink-0">
                            <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-amber-200 animate-[spin_4s_linear_infinite]" />
                            <span className="font-black text-white text-lg sm:text-2xl drop-shadow-md">{totalStars}</span>
                        </div>
                        
                        {/* Student selector dropdown or Guest login prompt */}
                        {auth.user ? (
                            <div className="relative pointer-events-auto">
                                <button onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border-[3px] border-white shadow-lg flex items-center gap-2 font-extrabold text-[10px] sm:text-sm text-indigo-700 hover:bg-white transition-all whitespace-nowrap">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {selectedStudent ? selectedStudent.name : 'Ganti Akun'}
                                    <span className="text-[8px] sm:text-[10px]">▼</span>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-indigo-100 overflow-hidden z-50">
                                        <div className="max-h-[50vh] overflow-y-auto no-scrollbar py-2">
                                            {students.map(s => (
                                                <button key={s.id} onClick={() => selectAccount(s)}
                                                    className={`w-full text-left px-4 py-2.5 text-[10px] sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                                        selectedStudent?.id === s.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                                                    }`}>
                                                    <span className="text-lg">{s.avatar_url === 'boy' ? '👦' : '👧'}</span>
                                                    {s.name}
                                                    {selectedStudent?.id === s.id && <Check className="w-3.5 h-3.5 ml-auto text-indigo-500" />}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-2 bg-slate-50 border-t border-slate-100">
                                            <button onClick={() => router.visit('/parent/dashboard')}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-[10px] sm:text-xs bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all">
                                                <Plus className="w-3 h-3" /> Tambah Anak
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => router.visit('/login')}
                                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full sm:rounded-[20px] font-black text-[10px] sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all animate-pulse shadow-lg border-[3px] border-white whitespace-nowrap">
                                <User className="w-3 h-3 sm:w-5 sm:h-5" /> Simpan Skor
                            </button>
                        )}
                    </div>
                </div>

                {/* The Map Canvas */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    
                    {/* PORTRAIT MAP */}
                    <div className="absolute inset-0 w-full h-full landscape:hidden">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 25 76 C 50 81, 70 66, 75 56 C 80 41, 50 46, 30 36 C 15 26, 45 16, 70 21" 
                                  fill="none" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="8" strokeDasharray="1 25" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                            <path d="M 25 75 C 50 80, 70 65, 75 55 C 80 40, 50 45, 30 35 C 15 25, 45 15, 70 20" 
                                  fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="8" strokeDasharray="1 25" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                        </svg>

                        {displayLevels.map((level, idx) => {
                            const mapNodes = [
                                { left: '25%', top: '75%' }, 
                                { left: '75%', top: '55%' }, 
                                { left: '30%', top: '35%' }, 
                                { left: '70%', top: '20%' }, 
                            ];
                            return renderNode(level, idx, mapNodes[idx], 'portrait');
                        })}
                    </div>

                    {/* LANDSCAPE MAP */}
                    <div className="absolute inset-0 w-full h-full hidden landscape:block">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 18 56 C 28 31, 35 31, 40 41 C 45 51, 55 81, 65 61 C 75 41, 80 41, 85 41" 
                                  fill="none" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="8" strokeDasharray="1 25" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                            <path d="M 18 55 C 28 30, 35 30, 40 40 C 45 50, 55 80, 65 60 C 75 40, 80 40, 85 40" 
                                  fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="8" strokeDasharray="1 25" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                        </svg>

                        {displayLevels.map((level, idx) => {
                            const mapNodes = [
                                { left: '18%', top: '55%' }, 
                                { left: '40%', top: '40%' }, 
                                { left: '65%', top: '60%' }, 
                                { left: '85%', top: '40%' }, 
                            ];
                            return renderNode(level, idx, mapNodes[idx], 'landscape');
                        })}
                    </div>
                </div>

                {/* Hufi mascot floating in bottom left */}
                <div className="absolute bottom-0 sm:bottom-2 left-0 sm:left-2 z-20 pointer-events-none hidden md:block landscape:hidden lg:landscape:block">
                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                        <div className="relative">
                            <div className="absolute -top-10 sm:-top-14 left-8 sm:left-12 bg-white/95 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 rounded-3xl rounded-bl-none shadow-2xl border-[3px] border-indigo-100 min-w-[140px] sm:min-w-[180px]">
                                <p className="text-xs sm:text-sm font-black text-indigo-900 leading-tight">Ayo raih skor <br/><span className="text-amber-500 text-base sm:text-lg">80</span> untuk lanjut! ✨</p>
                            </div>
                            <MascotHufi pose="winking" className="w-32 h-32 sm:w-48 sm:h-48 drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
