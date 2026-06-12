import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const inputCls = 'w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-4 py-3.5 landscape:py-2 lg:landscape:py-3.5 font-semibold text-sm focus:outline-none focus:border-indigo-500 transition-colors';

    return (
        <div className="min-h-screen night-hero flex flex-col text-white font-sans">
            <Head title="Daftar — Pintar Hijaiyah" />

            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10 w-full max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full landscape:flex-row landscape:gap-4 lg:landscape:gap-20">
                    
                    {/* ── Left Side: Mascot & Welcome Message ── */}
                    <div className="hidden md:flex landscape:flex flex-col items-center justify-center w-full lg:w-1/2 mt-10 lg:mt-0 landscape:mt-0 landscape:scale-75 lg:landscape:scale-100 origin-center">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1c1c3f]/80 backdrop-blur-md rounded-3xl border border-white/10 text-white p-6 shadow-2xl mb-6 relative text-center"
                        >
                            <h1 className="text-3xl font-black mb-2 text-amber-300">Mari Bergabung! ✨</h1>
                            <p className="text-sm font-semibold text-white/80">
                                Buat akun Orang Tua untuk memantau perkembangan belajar anak.
                            </p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1c1c3f]/80 border-b border-r border-white/10 rotate-45" />
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, -15, 0] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-amber-500/30 blur-[60px] rounded-full" />
                            <img
                                src="/images/maskod/sprite_05.png"
                                alt="Maskot Hufi"
                                className="w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] relative z-10"
                            />
                        </motion.div>
                    </div>

                    {/* ── Right Side: Register Form Card ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                        className="w-full max-w-md landscape:w-1/2 landscape:max-w-xl lg:landscape:max-w-md"
                    >
                        {/* Mobile Mascot Header */}
                        <div className="md:hidden flex flex-col items-center mb-6 landscape:hidden">
                            <motion.img 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                src="/images/maskod/sprite_05.png" 
                                alt="Hufi" 
                                className="w-24 h-24 object-contain drop-shadow-lg mb-2" 
                            />
                            <h2 className="text-2xl font-black text-white text-center drop-shadow-md">Buat Akun Baru</h2>
                        </div>

                        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 landscape:p-4 lg:landscape:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[6px] border-white/40">
                            <div className="text-center mb-6 landscape:mb-2 lg:landscape:mb-6 hidden md:block landscape:block">
                                <h2 className="text-3xl landscape:text-xl lg:landscape:text-3xl font-black text-slate-800">Daftar Akun</h2>
                                <p className="text-slate-500 font-bold text-sm landscape:text-xs lg:landscape:text-sm mt-1">Gabung sekarang, gratis selamanya!</p>
                            </div>

                            <form onSubmit={submit} className="space-y-4 landscape:space-y-0 landscape:grid landscape:grid-cols-2 landscape:gap-2 lg:landscape:space-y-4 lg:landscape:block">
                                <div className="landscape:col-span-1 lg:landscape:col-span-full">
                                    <div className="relative">
                                        <User className="absolute left-4 top-[14px] landscape:top-[10px] lg:landscape:top-[14px] text-slate-400 w-5 h-5" />
                                        <input id="name" type="text" value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Nama Lengkap" required autoFocus
                                            className={`${inputCls} pl-12 text-slate-800`} />
                                    </div>
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</p>}
                                </div>

                                <div className="landscape:col-span-1 lg:landscape:col-span-full">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-[14px] landscape:top-[10px] lg:landscape:top-[14px] text-slate-400 w-5 h-5" />
                                        <input id="email" type="email" value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="Email" required
                                            className={`${inputCls} pl-12 text-slate-800`} />
                                    </div>
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</p>}
                                </div>

                                <div className="landscape:col-span-1 lg:landscape:col-span-full mt-0 lg:landscape:mt-4">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-[14px] landscape:top-[10px] lg:landscape:top-[14px] text-slate-400 w-5 h-5" />
                                        <input id="password" type="password" value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Password (min. 8)" required
                                            className={`${inputCls} pl-12 text-slate-800`} />
                                    </div>
                                    {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.password}</p>}
                                </div>

                                <div className="landscape:col-span-1 lg:landscape:col-span-full mt-0 lg:landscape:mt-4">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-[14px] landscape:top-[10px] lg:landscape:top-[14px] text-slate-400 w-5 h-5" />
                                        <input id="password_confirmation" type="password" value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi Password" required
                                            className={`${inputCls} pl-12 text-slate-800`} />
                                    </div>
                                    {errors.password_confirmation && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.password_confirmation}</p>}
                                </div>

                                <div className="landscape:col-span-2 lg:landscape:col-span-full mt-4 landscape:mt-2 lg:landscape:mt-4 pt-1">
                                    <button type="submit" id="btn-register" disabled={processing}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-lg landscape:text-base lg:landscape:text-lg py-4 landscape:py-2 lg:landscape:py-4 rounded-2xl shadow-[0_8px_0_#b45309] hover:translate-y-[2px] hover:shadow-[0_6px_0_#b45309] active:translate-y-[8px] active:shadow-none transition-all flex justify-center items-center gap-2">
                                        <UserPlus size={20} />
                                        {processing ? '⏳ Mendaftar...' : 'Daftar Sekarang'}
                                    </button>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 landscape:mt-3 lg:landscape:mt-6 text-center text-sm landscape:text-xs lg:landscape:text-sm font-bold text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-indigo-600 hover:text-indigo-700 font-black hover:underline">
                                    Masuk di sini
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
