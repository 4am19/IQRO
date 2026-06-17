import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, LogIn, Sparkles, Eye, EyeOff } from 'lucide-react';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';

const AnimatedInput = ({ icon: Icon, type, value, onChange, placeholder, error, onFocus, onBlur }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const paddingRight = isPassword ? 'pr-12 landscape:pr-10 lg:landscape:pr-12' : 'pr-4 landscape:pr-3 lg:landscape:pr-4';

    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="relative"
        >
            <div className={`absolute inset-y-0 left-0 pl-4 landscape:pl-3 lg:landscape:pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-indigo-600' : 'text-indigo-400'}`}>
                <motion.div animate={isFocused ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}>
                    <Icon className="h-5 w-5 landscape:h-3.5 landscape:w-3.5 lg:landscape:h-5 lg:landscape:w-5" />
                </motion.div>
            </div>
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                onFocus={(e) => { setIsFocused(true); if (onFocus) onFocus(e); }}
                onBlur={(e) => { setIsFocused(false); if (onBlur) onBlur(e); }}
                className={`block w-full pl-12 landscape:pl-9 lg:landscape:pl-12 ${paddingRight} py-3 landscape:py-1.5 lg:landscape:py-3.5 bg-slate-50/80 border-[3px] border-transparent rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl text-slate-800 font-bold text-base landscape:text-[11px] lg:landscape:text-base placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all outline-none`}
                placeholder={placeholder}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 landscape:pr-3 lg:landscape:pr-4 pl-2 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5 landscape:w-3.5 landscape:h-3.5 lg:landscape:w-5 lg:landscape:h-5" />
                    ) : (
                        <Eye className="w-5 h-5 landscape:w-3.5 landscape:h-3.5 lg:landscape:w-5 lg:landscape:h-5" />
                    )}
                </button>
            )}
        </motion.div>
    );
};

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <FullscreenWrapper>
            <div className="min-h-screen learn-fantasy-bg flex flex-col font-sans overflow-y-auto overflow-x-hidden relative">
                <Head title="Masuk — Pintar Hijaiyah" />
                
                {/* Back Button - Top Left */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-50"
                >
                    <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white font-bold bg-[#1a1744]/60 hover:bg-[#1a1744]/90 backdrop-blur-md border border-white/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali ke Beranda</span>
                        <span className="sm:hidden">Beranda</span>
                    </Link>
                </motion.div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/20 rounded-full blur-2xl"
                        animate={{
                            y: [0, -100, 0],
                            x: [0, 100, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: Math.random() * 150 + 50,
                            height: Math.random() * 150 + 50,
                            left: Math.random() * 100 + '%',
                            top: -200
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 flex items-center justify-center p-4 landscape:p-2 lg:landscape:p-8 w-full max-w-7xl mx-auto min-h-min z-10 relative">
                
                <div className="flex flex-col landscape:flex-row items-center justify-center gap-6 landscape:gap-4 lg:landscape:gap-16 w-full">
                    
                    {/* ── Left Side: Mascot & Welcome Message ── */}
                    <div className="hidden landscape:flex md:flex flex-col items-center justify-center w-full landscape:w-5/12 lg:landscape:w-1/2 max-w-sm lg:max-w-lg relative group">
                        <motion.div 
                            initial={{ opacity: 0, y: -40, rotate: -5 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                            className="bg-gradient-to-br from-[#1c1c3f]/90 to-[#2a2a5a]/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 text-white p-4 landscape:p-2 lg:landscape:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-4 landscape:mb-2 lg:landscape:mb-6 relative text-center w-full overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-50" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
                            <motion.h1 
                                className="text-xl landscape:text-sm lg:landscape:text-3xl font-black mb-1 lg:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 relative z-10"
                                animate={{ textShadow: ['0px 0px 10px rgba(251,191,36,0)', '0px 0px 20px rgba(251,191,36,0.3)', '0px 0px 10px rgba(251,191,36,0)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Selamat Datang! ✨
                            </motion.h1>
                            <p className="text-sm landscape:text-[10px] lg:landscape:text-sm font-semibold text-white/90 hidden sm:block relative z-10">
                                Ayo lanjutkan petualangan belajarmu bersama Hufi!
                            </p>
                            <div className="absolute -bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 lg:w-6 lg:h-6 bg-[#2a2a5a]/90 border-b border-r border-white/20 rotate-45 z-10" />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, -15, 0] }} 
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative mt-2 lg:mt-4 group-hover:scale-105 transition-transform duration-500"
                        >
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 m-auto w-[120%] h-[120%] border-[2px] border-dashed border-indigo-400/30 rounded-full"
                            />
                            <div className="absolute inset-0 bg-indigo-500/40 blur-[40px] lg:blur-[80px] rounded-full mix-blend-screen" />
                            
                            <img
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-32 h-32 landscape:w-24 landscape:h-24 lg:landscape:w-80 lg:landscape:h-80 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] relative z-10"
                            />
                        </motion.div>
                    </div>

                    {/* ── Right Side: Login Form Card ── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md landscape:w-7/12 landscape:max-w-md lg:landscape:w-1/2 relative"
                    >
                        {/* Mobile Portrait Mascot Header */}
                        <div className="md:hidden landscape:hidden flex flex-col items-center mb-6">
                            <motion.img 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png" 
                                alt="Hufi" 
                                className="w-28 h-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-2" 
                            />
                            <h2 className="text-2xl font-black text-white text-center drop-shadow-md">Masuk ke Akunmu</h2>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl lg:rounded-[32px] p-6 landscape:p-4 lg:landscape:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(255,255,255,0.2)_inset] border border-white/60 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                            <motion.div variants={itemVariants} className="text-center mb-6 landscape:mb-2 lg:landscape:mb-8 hidden landscape:block md:block relative z-10">
                                <h2 className="text-2xl landscape:text-lg lg:landscape:text-3xl font-black text-slate-800">Masuk Akun</h2>
                                <p className="text-slate-500 font-bold text-sm landscape:text-[10px] lg:landscape:text-sm mt-1">Masukkan email dan sandi untuk mulai bermain</p>
                            </motion.div>

                            {status && (
                                <motion.div variants={itemVariants} className="bg-emerald-50 border-[3px] border-emerald-200 text-emerald-700 rounded-xl lg:rounded-2xl p-3 landscape:p-2 lg:landscape:p-4 text-sm landscape:text-[10px] lg:landscape:text-sm font-bold mb-4 landscape:mb-2 lg:landscape:mb-6 flex items-center gap-2 shadow-sm relative z-10">
                                    <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" /> {status}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-4 landscape:space-y-2 lg:landscape:space-y-5 relative z-10">
                                
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm landscape:text-[10px] lg:landscape:text-sm font-extrabold text-slate-700 mb-1.5 landscape:mb-0.5 lg:landscape:mb-1.5 ml-2">Email</label>
                                    <AnimatedInput
                                        icon={Mail}
                                        type="email"
                                        value={data.email}
                                        onChange={(e: any) => setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                    />
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs landscape:text-[10px] lg:landscape:text-xs font-black mt-1 ml-2">
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm landscape:text-[10px] lg:landscape:text-sm font-extrabold text-slate-700 mb-1.5 landscape:mb-0.5 lg:landscape:mb-1.5 ml-2">Kata Sandi</label>
                                    <AnimatedInput
                                        icon={Lock}
                                        type="password"
                                        value={data.password}
                                        onChange={(e: any) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-xs landscape:text-[10px] lg:landscape:text-xs font-black mt-1 ml-2">
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex items-center justify-between text-sm landscape:text-[10px] lg:landscape:text-sm px-2 pt-1">
                                    <label className="flex items-center gap-2 landscape:gap-1.5 lg:landscape:gap-2 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={e => setData('remember', e.target.checked)}
                                                className="peer w-5 h-5 landscape:w-3.5 landscape:h-3.5 lg:landscape:w-5 lg:landscape:h-5 rounded-[6px] landscape:rounded-[4px] lg:landscape:rounded-[6px] border-[3px] border-slate-300 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all"
                                            />
                                        </div>
                                        <span className="font-bold text-slate-500 group-hover:text-slate-800 transition-colors select-none">Ingat saya</span>
                                    </label>
                                    
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="font-extrabold text-indigo-500 hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all">
                                            Lupa sandi?
                                        </Link>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        disabled={processing}
                                        className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 via-[#5b51d8] to-violet-500 hover:from-indigo-400 hover:via-indigo-500 hover:to-violet-400 text-white font-black text-lg landscape:text-xs lg:landscape:text-lg py-4 landscape:py-2 lg:landscape:py-4 rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl shadow-[0_8px_0_rgba(49,46,129,1),0_15px_20px_rgba(67,56,202,0.4)] landscape:shadow-[0_4px_0_rgba(49,46,129,1)] lg:landscape:shadow-[0_8px_0_rgba(49,46,129,1)] hover:shadow-[0_6px_0_rgba(49,46,129,1),0_10px_15px_rgba(67,56,202,0.4)] landscape:hover:shadow-[0_2px_0_rgba(49,46,129,1)] lg:landscape:hover:shadow-[0_6px_0_rgba(49,46,129,1)] active:translate-y-[8px] landscape:active:translate-y-[4px] lg:landscape:active:translate-y-[8px] active:shadow-none transition-all flex justify-center items-center gap-2 mt-6 landscape:mt-3 lg:landscape:mt-6 group"
                                    >
                                        <motion.div 
                                            animate={{ x: ['-200%', '200%'] }} 
                                            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                                        />
                                        
                                        {processing ? '⏳ Memproses...' : (
                                            <>
                                                Ayo Masuk 
                                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                                                    <LogIn className="w-5 h-5 landscape:w-3 landscape:h-3 lg:landscape:w-5 lg:landscape:h-5" />
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>

                            <motion.div variants={itemVariants} className="mt-6 landscape:mt-3 lg:landscape:mt-6 text-center text-sm landscape:text-[10px] lg:landscape:text-sm font-bold text-slate-500 relative z-10">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="text-amber-500 hover:text-amber-600 font-black relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-amber-500 after:transition-all">
                                    Daftar sekarang!
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
        </FullscreenWrapper>
    );
}
