import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen learn-fantasy-bg flex flex-col font-sans">
            <Head title="Masuk — Pintar Hijaiyah" />

            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10 w-full max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full landscape:flex-row landscape:gap-4 lg:landscape:gap-20">
                    
                    {/* ── Left Side: Mascot & Welcome Message ── */}
                    <div className="hidden md:flex landscape:flex flex-col items-center justify-center w-full lg:w-1/2 mt-10 lg:mt-0 landscape:mt-0 landscape:scale-75 lg:landscape:scale-100 origin-center">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1c1c3f]/80 backdrop-blur-md rounded-3xl border border-white/10 text-white p-6 shadow-2xl mb-6 relative text-center"
                        >
                            <h1 className="text-3xl font-black mb-2 text-amber-300">Selamat Datang Kembali! ✨</h1>
                            <p className="text-sm font-semibold text-white/80">
                                Ayo lanjutkan petualangan belajarmu bersama Hufi!
                            </p>
                            {/* Little speech bubble tail */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1c1c3f]/80 border-b border-r border-white/10 rotate-45" />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, -15, 0] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative"
                        >
                            {/* Soft glow behind mascot */}
                            <div className="absolute inset-0 bg-indigo-500/30 blur-[60px] rounded-full" />
                            <img
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] relative z-10"
                            />
                        </motion.div>
                    </div>

                    {/* ── Right Side: Login Form Card ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                        className="w-full max-w-md landscape:w-1/2 landscape:max-w-sm lg:landscape:max-w-md"
                    >
                        {/* Mobile Mascot Header */}
                        <div className="md:hidden flex flex-col items-center mb-6 landscape:hidden">
                            <motion.img 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png" 
                                alt="Hufi" 
                                className="w-28 h-28 object-contain drop-shadow-lg mb-2" 
                            />
                            <h2 className="text-2xl font-black text-white text-center drop-shadow-md">Masuk ke Akunmu</h2>
                        </div>

                        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 landscape:p-4 lg:landscape:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[6px] border-white/40">
                            <div className="text-center mb-8 landscape:mb-2 lg:landscape:mb-8 hidden md:block landscape:block">
                                <h2 className="text-3xl landscape:text-xl lg:landscape:text-3xl font-black text-slate-800">Masuk Akun</h2>
                                <p className="text-slate-500 font-bold text-sm landscape:text-xs lg:landscape:text-sm mt-1">Masukkan email dan sandi untuk mulai</p>
                            </div>

                            {status && (
                                <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-2xl p-4 landscape:p-2 lg:landscape:p-4 text-sm font-bold mb-6 landscape:mb-2 lg:landscape:mb-6 flex items-center gap-3">
                                    <span className="text-lg">✅</span> {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5 landscape:space-y-2 lg:landscape:space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-1.5 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3.5 landscape:py-2 lg:landscape:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                                            placeholder="contoh@email.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-rose-500 text-xs font-black mt-1.5 ml-1">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-extrabold text-slate-700 mb-1.5 ml-1">Kata Sandi</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3.5 landscape:py-2 lg:landscape:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="text-rose-500 text-xs font-black mt-1.5 ml-1">{errors.password}</p>}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm px-1 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={e => setData('remember', e.target.checked)}
                                            className="w-5 h-5 rounded-[6px] border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Ingat saya</span>
                                    </label>
                                    
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="font-extrabold text-indigo-500 hover:text-indigo-700 hover:underline">
                                            Lupa sandi?
                                        </Link>
                                    )}
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#5b51d8] hover:bg-indigo-600 text-white font-black text-lg landscape:text-base lg:landscape:text-lg py-4 landscape:py-2 lg:landscape:py-4 rounded-2xl shadow-[0_8px_0_rgba(67,56,202,1)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgba(67,56,202,1)] active:translate-y-[8px] active:shadow-none transition-all flex justify-center items-center gap-2 mt-4 landscape:mt-2 lg:landscape:mt-4"
                                >
                                    {processing ? '⏳ Memproses...' : (
                                        <>
                                            Ayo Masuk <LogIn className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-8 text-center text-sm font-bold text-slate-500">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="text-amber-500 hover:text-amber-600 font-black hover:underline">
                                    Daftar sekarang!
                                </Link>
                            </div>
                        </div>
                        
                        {/* Back Button */}
                        <div className="mt-6 landscape:mt-2 lg:landscape:mt-6 text-center">
                            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold bg-[#1a1744]/40 hover:bg-[#1a1744]/60 backdrop-blur-md px-6 py-3 landscape:py-1.5 lg:landscape:py-3 rounded-full transition-all landscape:text-xs lg:landscape:text-base">
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
