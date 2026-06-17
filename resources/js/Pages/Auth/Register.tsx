import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';

const AnimatedInput = ({ icon: Icon, type, value, onChange, placeholder, id }: any) => {
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
            <div className={`absolute inset-y-0 left-0 pl-4 landscape:pl-3 lg:landscape:pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-amber-500' : 'text-slate-400'}`}>
                <motion.div animate={isFocused ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}>
                    <Icon className="w-5 h-5 landscape:w-3.5 landscape:h-3.5 lg:landscape:w-5 lg:landscape:h-5" />
                </motion.div>
            </div>
            <input
                id={id}
                type={inputType}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full border-[3px] border-transparent bg-slate-50/80 rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl pl-12 landscape:pl-9 lg:landscape:pl-12 ${paddingRight} py-3 landscape:py-1.5 lg:landscape:py-3.5 text-slate-800 font-bold text-base landscape:text-[11px] lg:landscape:text-base focus:bg-white focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all outline-none`}
                placeholder={placeholder}
                required
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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
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
                <Head title="Daftar — Pintar Hijaiyah" />
                
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
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-amber-500/20 rounded-full blur-2xl"
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
                            initial={{ opacity: 0, y: -40, rotate: 5 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                            className="bg-gradient-to-bl from-[#1c1c3f]/90 to-[#2a2a5a]/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 text-white p-4 landscape:p-2 lg:landscape:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-4 landscape:mb-2 lg:landscape:mb-6 relative text-center w-full overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-50" style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
                            <motion.h1 
                                className="text-xl landscape:text-sm lg:landscape:text-3xl font-black mb-1 lg:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 relative z-10"
                                animate={{ textShadow: ['0px 0px 10px rgba(251,191,36,0)', '0px 0px 20px rgba(251,191,36,0.3)', '0px 0px 10px rgba(251,191,36,0)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Mari Bergabung! ✨
                            </motion.h1>
                            <p className="text-sm landscape:text-[10px] lg:landscape:text-sm font-semibold text-white/90 hidden sm:block relative z-10">
                                Buat akun Orang Tua untuk memantau perkembangan belajar anak.
                            </p>
                            <div className="absolute -bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 lg:w-6 lg:h-6 bg-[#2a2a5a]/90 border-b border-r border-white/20 rotate-45 z-10" />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, -15, 0] }} 
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative mt-2 lg:mt-4 group-hover:scale-105 transition-transform duration-500"
                        >
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 m-auto w-[120%] h-[120%] border-[2px] border-dashed border-amber-400/30 rounded-full"
                            />
                            <div className="absolute inset-0 bg-amber-500/40 blur-[40px] lg:blur-[80px] rounded-full mix-blend-screen" />
                            
                            <img
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-32 h-32 landscape:w-24 landscape:h-24 lg:landscape:w-80 lg:landscape:h-80 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] relative z-10"
                            />
                        </motion.div>
                    </div>

                    {/* ── Right Side: Register Form Card ── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md landscape:w-7/12 landscape:max-w-xl lg:landscape:w-1/2 relative"
                    >
                        {/* Mobile Portrait Mascot Header */}
                        <div className="md:hidden landscape:hidden flex flex-col items-center mb-6">
                            <motion.img 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png" 
                                alt="Hufi" 
                                className="w-24 h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-2" 
                            />
                            <h2 className="text-2xl font-black text-white text-center drop-shadow-md">Buat Akun Baru</h2>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl lg:rounded-[32px] p-6 landscape:p-4 lg:landscape:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(255,255,255,0.2)_inset] border border-white/60 relative overflow-hidden text-slate-800"
                        >
                            {/* Inner shine effect */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                            
                            {/* Form Header */}
                            <motion.div variants={itemVariants} className="text-center mb-6 landscape:mb-2 lg:landscape:mb-6 hidden landscape:block md:block relative z-10">
                                <h2 className="text-2xl landscape:text-lg lg:landscape:text-3xl font-black text-slate-800">Daftar Akun</h2>
                                <p className="text-slate-500 font-bold text-sm landscape:text-[10px] lg:landscape:text-sm mt-1">Gabung sekarang, gratis selamanya!</p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-4 landscape:space-y-0 landscape:grid landscape:grid-cols-2 landscape:gap-x-2 landscape:gap-y-1.5 lg:landscape:space-y-4 lg:landscape:block relative z-10">
                                
                                <motion.div variants={itemVariants} className="landscape:col-span-1 lg:landscape:col-span-full">
                                    <AnimatedInput
                                        id="name"
                                        icon={User}
                                        type="text"
                                        value={data.name}
                                        onChange={(e: any) => setData('name', e.target.value)}
                                        placeholder="Nama Lengkap"
                                    />
                                    <AnimatePresence>
                                        {errors.name && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</motion.p>}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="landscape:col-span-1 lg:landscape:col-span-full">
                                    <AnimatedInput
                                        id="email"
                                        icon={Mail}
                                        type="email"
                                        value={data.email}
                                        onChange={(e: any) => setData('email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    <AnimatePresence>
                                        {errors.email && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</motion.p>}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="landscape:col-span-1 lg:landscape:col-span-full mt-0 lg:landscape:mt-4">
                                    <AnimatedInput
                                        id="password"
                                        icon={Lock}
                                        type="password"
                                        value={data.password}
                                        onChange={(e: any) => setData('password', e.target.value)}
                                        placeholder="Password (min. 8)"
                                    />
                                    <AnimatePresence>
                                        {errors.password && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.password}</motion.p>}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="landscape:col-span-1 lg:landscape:col-span-full mt-0 lg:landscape:mt-4">
                                    <AnimatedInput
                                        id="password_confirmation"
                                        icon={Lock}
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e: any) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi Password"
                                    />
                                    <AnimatePresence>
                                        {errors.password_confirmation && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.password_confirmation}</motion.p>}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="landscape:col-span-2 lg:landscape:col-span-full mt-4 landscape:mt-2 lg:landscape:mt-4 pt-1">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit" 
                                        id="btn-register" 
                                        disabled={processing}
                                        className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 via-[#d97706] to-yellow-500 hover:from-amber-400 hover:via-amber-500 hover:to-yellow-400 text-white font-black text-lg landscape:text-xs lg:landscape:text-lg py-4 landscape:py-2 lg:landscape:py-4 rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl shadow-[0_8px_0_#92400e,0_15px_20px_rgba(217,119,6,0.4)] landscape:shadow-[0_4px_0_#92400e] lg:landscape:shadow-[0_8px_0_#92400e] hover:shadow-[0_6px_0_#92400e,0_10px_15px_rgba(217,119,6,0.4)] landscape:hover:shadow-[0_2px_0_#92400e] lg:landscape:hover:shadow-[0_6px_0_#92400e] active:translate-y-[8px] landscape:active:translate-y-[4px] lg:landscape:active:translate-y-[8px] active:shadow-none transition-all flex justify-center items-center gap-2 group"
                                    >
                                        <motion.div 
                                            animate={{ x: ['-200%', '200%'] }} 
                                            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                                        />
                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                                            <UserPlus className="w-5 h-5 landscape:w-3 landscape:h-3 lg:landscape:w-5 lg:landscape:h-5" />
                                        </motion.div>
                                        {processing ? '⏳ Mendaftar...' : 'Daftar Sekarang'}
                                    </motion.button>
                                </motion.div>
                            </form>

                            {/* Login Link */}
                            <motion.div variants={itemVariants} className="mt-6 landscape:mt-3 lg:landscape:mt-6 text-center text-sm landscape:text-[10px] lg:landscape:text-sm font-bold text-slate-500 relative z-10">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-indigo-600 hover:text-indigo-700 font-black relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all">
                                    Masuk di sini
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
