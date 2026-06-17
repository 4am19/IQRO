import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import FullscreenWrapper from '@/Components/Organisms/FullscreenWrapper';
import MascotHufi from '@/Components/MascotHufi';

const AnimatedInput = ({ icon: Icon, type, value, onChange, placeholder, error, onFocus, onBlur }: any) => {
    const [isFocused, setIsFocused] = useState(false);

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
                type={type}
                value={value}
                onChange={onChange}
                onFocus={(e) => { setIsFocused(true); if (onFocus) onFocus(e); }}
                onBlur={(e) => { setIsFocused(false); if (onBlur) onBlur(e); }}
                className={`block w-full pl-12 landscape:pl-9 lg:landscape:pl-12 pr-4 landscape:pr-3 lg:landscape:pr-4 py-3 landscape:py-1.5 lg:landscape:py-3.5 bg-slate-50/80 border-[3px] border-transparent rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl text-slate-800 font-bold text-base landscape:text-[11px] lg:landscape:text-base placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] transition-all outline-none`}
                placeholder={placeholder}
                required
            />
        </motion.div>
    );
};

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <FullscreenWrapper>
            <div className="min-h-screen learn-fantasy-bg flex flex-col font-sans overflow-y-auto overflow-x-hidden relative">
                <Head title="Lupa Kata Sandi — Pintar Hijaiyah" />
                
                {/* Back Button - Top Left */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-50"
                >
                    <Link href={route('login')} className="flex items-center gap-2 text-white/90 hover:text-white font-bold bg-[#1a1744]/60 hover:bg-[#1a1744]/90 backdrop-blur-md border border-white/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali ke Login</span>
                        <span className="sm:hidden">Kembali</span>
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
                                width: `${Math.random() * 300 + 100}px`,
                                height: `${Math.random() * 300 + 100}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                background: i % 2 === 0 ? 'rgba(79, 70, 229, 0.3)' : 'rgba(129, 140, 248, 0.3)'
                            }}
                        />
                    ))}
                </div>

                <div className="flex-1 flex items-center justify-center p-4 landscape:p-2 lg:landscape:p-4 z-10 mt-8 landscape:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="w-full max-w-md landscape:max-w-3xl lg:landscape:max-w-4xl bg-white/90 backdrop-blur-xl rounded-[2rem] landscape:rounded-[1.5rem] lg:landscape:rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden relative"
                    >
                        {/* Top Gradient Inset Shadow */}
                        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-20" />

                        <div className="flex flex-col landscape:flex-row h-full relative z-10">
                            {/* Header Section */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 landscape:p-4 lg:landscape:p-8 landscape:w-[45%] flex flex-col items-center justify-center text-white relative overflow-hidden shrink-0 rounded-t-[2rem] landscape:rounded-none landscape:rounded-l-[1.5rem] lg:landscape:rounded-l-[2rem]">
                                <motion.div 
                                    className="absolute inset-0 opacity-30"
                                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                                    style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                                />
                                
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 w-32 h-32 landscape:w-20 landscape:h-20 lg:landscape:w-32 lg:landscape:h-32 mb-4 landscape:mb-2 lg:landscape:mb-4"
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                                    <MascotHufi pose="happy" className="w-full h-full drop-shadow-2xl" />
                                </motion.div>
                                
                                <h1 className="text-3xl landscape:text-xl lg:landscape:text-3xl font-black mb-2 text-center drop-shadow-md relative z-10" style={{ fontFamily: "'Lilita One', cursive" }}>
                                    Lupa Sandi?
                                </h1>
                                <p className="text-center text-indigo-100 font-medium text-sm landscape:text-[10px] lg:landscape:text-sm relative z-10 px-4">
                                    Tenang saja! Masukkan email kamu dan Hufi akan kirimkan link untuk buat sandi baru.
                                </p>
                            </div>

                            {/* Form Section */}
                            <div className="p-6 landscape:p-4 lg:landscape:p-8 landscape:w-[55%] flex flex-col justify-center relative bg-white/50">
                                <AnimatePresence>
                                    {status && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-4 mt-8 landscape:mt-4 lg:landscape:mt-8 p-3 landscape:p-2 lg:landscape:p-3 bg-green-100 border-2 border-green-300 text-green-700 rounded-xl landscape:rounded-lg lg:landscape:rounded-xl text-sm landscape:text-[10px] lg:landscape:text-sm font-bold text-center"
                                        >
                                            {status}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={submit} className={`flex flex-col gap-4 landscape:gap-2 lg:landscape:gap-4 ${!status ? 'mt-8 landscape:mt-4 lg:landscape:mt-8' : ''}`}>
                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-sm landscape:text-[10px] lg:landscape:text-sm font-bold text-slate-700 ml-2">
                                            Email Terdaftar <span className="text-rose-500">*</span>
                                        </label>
                                        <AnimatedInput
                                            icon={Mail}
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e: any) => setData('email', e.target.value)}
                                            placeholder="contoh@email.com"
                                        />
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.p 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-rose-500 text-sm landscape:text-[9px] lg:landscape:text-sm font-bold ml-2 mt-1"
                                                >
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={processing}
                                        className="w-full mt-2 landscape:mt-1 lg:landscape:mt-2 relative overflow-hidden bg-gradient-to-b from-indigo-400 to-indigo-600 text-white font-black text-lg landscape:text-xs lg:landscape:text-lg py-4 landscape:py-2 lg:landscape:py-4 rounded-2xl landscape:rounded-xl lg:landscape:rounded-2xl shadow-[0_8px_0_#3730a3,0_15px_20px_rgba(79,70,229,0.4)] active:shadow-[0_0px_0_#3730a3,0_0px_0_rgba(79,70,229,0.4)] active:translate-y-[8px] transition-all flex items-center justify-center gap-2 group border-2 border-indigo-300 disabled:opacity-70"
                                    >
                                        <motion.div 
                                            animate={{ x: ['-200%', '200%'] }} 
                                            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                                        />
                                        <Send className="w-5 h-5 landscape:w-3.5 landscape:h-3.5 lg:landscape:w-5 lg:landscape:h-5" />
                                        <span>Kirim Link Reset Sandi</span>
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </FullscreenWrapper>
    );
}
