import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Settings, Play } from 'lucide-react';
import MascotHufi from '@/Components/MascotHufi';

interface Student {
    id: number;
    name: string;
    avatar_url?: string;
}

interface Props {
    students: Student[];
}

export default function ProfileSelect({ students }: Props) {
    const handleSelectProfile = (studentId: number) => {
        // Redirect to game select with the chosen student
        router.visit(`/game/select?student_id=${studentId}`);
    };

    return (
        <>
            <Head title="Pilih Profil" />

            <div className="min-h-screen bg-gradient-to-br from-[#1c1c3f] via-[#2d2b55] to-[#1c1c3f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                
                {/* Background Stars / Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"></div>
                    <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-amber-300 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-[20%] left-[30%] w-4 h-4 bg-indigo-300 rounded-full opacity-60 animate-[pulse_3s_infinite]"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 text-center mb-12"
                >
                    <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] mb-4">
                        Siapa yang mau bermain?
                    </h1>
                    <p className="text-indigo-200 text-lg font-bold">
                        Pilih profilmu untuk melanjutkan petualangan!
                    </p>
                </motion.div>

                <div className="z-10 flex flex-wrap justify-center gap-6 md:gap-10 max-w-4xl">
                    {/* Student Profiles */}
                    {students.map((student, index) => {
                        let colorClass = 'from-blue-400 to-indigo-600';
                        let emoji = '👦';

                        if (student.avatar_url === 'girl') {
                            colorClass = 'from-pink-400 to-rose-600';
                            emoji = '👧';
                        } else if (student.avatar_url === 'boy') {
                            colorClass = 'from-blue-400 to-indigo-600';
                            emoji = '👦';
                        } else {
                            // Fallback based on ID if no avatar_url is set
                            const fallbackColors = ['from-emerald-400 to-teal-600', 'from-amber-400 to-orange-500', 'from-purple-400 to-fuchsia-600'];
                            colorClass = fallbackColors[student.id % fallbackColors.length];
                            emoji = '👤';
                        }

                        return (
                            <motion.button
                                key={student.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
                                whileHover={{ scale: 1.1, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSelectProfile(student.id)}
                                className="group flex flex-col items-center gap-4 focus:outline-none"
                            >
                                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${colorClass} p-2 shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all relative`}>
                                    <div className="w-full h-full bg-[#1c1c3f]/20 rounded-full border-4 border-white/80 flex items-center justify-center text-6xl">
                                        {emoji}
                                    </div>
                                    
                                    {/* Play icon overlay on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                                        <Play className="w-16 h-16 text-white fill-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-md">
                                    {student.name}
                                </h2>
                            </motion.button>
                        );
                    })}

                    {/* Add Profile Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: students.length * 0.1, type: 'spring' }}
                    >
                        <Link
                            href="/parent/dashboard"
                            className="group flex flex-col items-center gap-4 focus:outline-none"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800/50 p-2 border-4 border-slate-600/50 group-hover:bg-slate-700/50 group-hover:border-indigo-400 transition-all flex items-center justify-center shadow-lg">
                                <Plus className="w-16 h-16 text-slate-400 group-hover:text-indigo-300 transition-colors" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-400 group-hover:text-indigo-300 transition-colors">
                                Tambah Akun
                            </h2>
                        </Link>
                    </motion.div>
                </div>

                {/* Parent Access Link */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 z-10"
                >
                    <Link 
                        href="/parent/dashboard" 
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold backdrop-blur-sm transition-all text-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Akses Orang Tua
                    </Link>
                </motion.div>

                {/* Hufi mascot peeking */}
                <motion.div 
                    initial={{ y: 150 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 15 }}
                    className="absolute -bottom-8 -right-8 md:bottom-0 md:right-0 pointer-events-none opacity-80"
                >
                    <MascotHufi pose="happy" className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl" />
                </motion.div>
            </div>
        </>
    );
}
