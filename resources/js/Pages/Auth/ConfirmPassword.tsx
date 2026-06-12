import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff, Shield, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MascotHufi from '@/Components/MascotHufi';

// Helper component for floating stars in the background
function BackgroundStars() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
}

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    // State to trigger a small typing bounce animation on the mascot
    const [typingPulse, setTypingPulse] = useState(0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    // Trigger typing pulse when password changes
    useEffect(() => {
        if (data.password.length > 0) {
            setTypingPulse(prev => prev + 1);
        }
    }, [data.password]);

    return (
        <div 
            className="h-screen-safe flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/background_comfirmasi_password.png')" }}
        >
            <Head title="Konfirmasi Keamanan" />
            
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none"></div>

            {/* Main Content Wrapper */}
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 relative">
                
                {/* Center Row: Mascot + Card */}
                <div className="flex flex-row items-end justify-center gap-8 lg:gap-16 w-full mt-4">
                    
                    {/* Left Mascot (Hidden on very small screens or landscape mobile to save space) */}
                    <div className="hidden md:flex flex-col items-center mb-10 landscape:hidden lg:landscape:flex">
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white px-5 py-3 rounded-3xl rounded-br-none shadow-xl mb-4 relative"
                        >
                            <p className="text-indigo-800 font-black text-sm text-center leading-tight">
                                Halo! 👋<br/>Ayo belajar<br/>bersama!
                            </p>
                            <div className="absolute -bottom-3 right-4 w-4 h-4 bg-white rotate-45 transform origin-top-left"></div>
                        </motion.div>
                        <motion.div
                            animate={{ 
                                y: isFocused ? [-3, 3, -3] : 0,
                                scale: [1, 1 + (typingPulse % 2 === 0 ? 0.05 : 0), 1] 
                            }}
                            transition={{ 
                                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                                scale: { duration: 0.2 }
                            }}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="cursor-pointer"
                        >
                            <MascotHufi pose={isFocused ? "happy" : "wave"} className="w-40 h-40 drop-shadow-2xl" />
                        </motion.div>
                    </div>

                    {/* Main Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(31,38,135,0.4)] w-full max-w-[400px] border-4 border-white flex flex-col p-6 sm:p-8 landscape:p-5 landscape:py-4 relative z-10"
                    >
                        {/* Top Section: Icon and Text */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <motion.div 
                                animate={isFocused ? { scale: 1.1, rotate: [0, -10, 10, -5, 5, 0] } : { scale: 1 }}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 sm:mb-5 landscape:mb-2 cursor-pointer"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 landscape:w-14 landscape:h-14 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner relative mx-auto">
                                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 landscape:w-7 landscape:h-7 text-indigo-500" />
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -bottom-1 -right-1 bg-emerald-400 p-1 rounded-full border-2 border-white shadow-sm"
                                    >
                                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <h2 className="text-2xl sm:text-3xl landscape:text-xl font-black text-indigo-800 mb-2 landscape:mb-1">Akses Terkunci</h2>
                            <p className="text-slate-500 text-sm landscape:text-[11px] font-bold leading-relaxed max-w-[280px] mx-auto mb-6 landscape:mb-3">
                                Area khusus Orang Tua. Masukkan kata sandi Anda.
                            </p>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={submit} className="w-full flex flex-col">
                            <div className="mb-5 landscape:mb-3">
                                <motion.div 
                                    className="relative group"
                                    animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
                                        <Lock className="w-5 h-5 landscape:w-4 landscape:h-4" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full pl-11 pr-12 py-3.5 sm:py-4 landscape:py-2.5 text-base sm:text-lg landscape:text-sm bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-bold placeholder:text-slate-400 placeholder:font-semibold"
                                        placeholder="Password Anda..."
                                        autoFocus
                                    />
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5 landscape:w-4 landscape:h-4" /> : <Eye className="w-5 h-5 landscape:w-4 landscape:h-4" />}
                                    </motion.button>
                                </motion.div>
                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <InputError message={errors.password} className="mt-1.5 text-center text-xs" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button 
                                type="submit" 
                                disabled={processing || !data.password}
                                whileHover={(!processing && data.password) ? { scale: 1.02 } : {}}
                                whileTap={(!processing && data.password) ? { scale: 0.95 } : {}}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-lg landscape:text-sm py-3.5 sm:py-4 landscape:py-2.5 rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                                {/* Sparkles effect in button */}
                                <div className="absolute top-1 left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
                                <div className="absolute bottom-2 right-6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-40 animate-pulse delay-75"></div>
                                
                                {processing ? (
                                    <>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                            <Lock className="w-5 h-5 landscape:w-4 landscape:h-4" />
                                        </motion.div>
                                        Memverifikasi...
                                    </>
                                ) : (
                                    <>
                                        Buka Kunci
                                        <ArrowLeft className="w-5 h-5 landscape:w-4 landscape:h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center justify-center my-5 landscape:my-3">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <motion.div whileHover={{ scale: 1.5, rotate: 15 }} className="cursor-pointer">
                                <Heart className="w-4 h-4 landscape:w-3 landscape:h-3 text-indigo-300 mx-3 fill-indigo-100" />
                            </motion.div>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Back Button */}
                        <div className="text-center">
                            <button 
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-extrabold transition-colors text-sm landscape:text-xs group"
                            >
                                <motion.div whileHover={{ x: -3 }}>
                                    <ArrowLeft className="w-4 h-4 landscape:w-3 landscape:h-3" />
                                </motion.div> 
                                <span className="group-hover:underline">Kembali</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Info Cards - Hidden on landscape mobile */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-row justify-center gap-2 sm:gap-4 mt-8 w-full max-w-3xl px-4 landscape:hidden"
                >
                    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 shadow-lg border-2 border-white/40 cursor-pointer group">
                        <motion.div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-800 group-hover:text-indigo-700 transition-colors">Aman</p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 leading-tight">Data Anda<br/>terlindungi</p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 shadow-lg border-2 border-white/40 cursor-pointer group">
                        <motion.div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors">Privasi</p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 leading-tight">Hanya untuk<br/>orang tua</p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 shadow-lg border-2 border-white/40 cursor-pointer group">
                        <motion.div className="bg-amber-100 p-2 rounded-xl text-amber-500 fill-amber-500 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                            <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-800 group-hover:text-amber-600 transition-colors">Kualitas</p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 leading-tight">Konten edukatif<br/>terbaik</p>
                        </div>
                    </motion.div>
                </motion.div>
                
            </div>
        </div>
    );
}
