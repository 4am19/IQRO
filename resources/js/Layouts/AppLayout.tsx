import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Play } from 'lucide-react';
import AppHeader from '@/Components/Organisms/AppHeader';
import MobileNav from '@/Components/Organisms/MobileNav';

interface Props {
    title?: string;
    description?: string;
    children: React.ReactNode;
    noPadding?: boolean;
    noHeader?: boolean;
    noNav?: boolean;
    fantasyBg?: boolean;
    fullWidth?: boolean;
    customBg?: string;
    staticHeader?: boolean;
}

export default function AppLayout({ title, description, children, noPadding = false, noHeader = false, noNav = false, fantasyBg = false, fullWidth = false, customBg, staticHeader = false }: Props) {
    const [showResumePrompt, setShowResumePrompt] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
        if (!isMobile) return;

        const checkFs = () => {
            const isFs = document.fullscreenElement || (document as any).webkitFullscreenElement;
            const hasStarted = sessionStorage.getItem('gameStarted') === 'true';
            
            if (hasStarted && !isFs) {
                setShowResumePrompt(true);
            } else {
                setShowResumePrompt(false);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Re-trigger --vh recalculation on return
                setTimeout(() => {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', vh + 'px');
                    checkFs();
                }, 200);
            }
        };

        // Also recalculate on resize (orientation change, keyboard, address bar)
        const handleResize = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
            checkFs();
        };

        document.addEventListener('fullscreenchange', checkFs);
        document.addEventListener('webkitfullscreenchange', checkFs);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);

        setTimeout(checkFs, 100);

        return () => {
            document.removeEventListener('fullscreenchange', checkFs);
            document.removeEventListener('webkitfullscreenchange', checkFs);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const resumeFullscreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) {
                await (document.documentElement as any).webkitRequestFullscreen();
            }
            if (window.screen && screen.orientation && (screen.orientation as any).lock) {
                (screen.orientation as any).lock('landscape').catch(() => {});
            }
        } catch (err) {
            console.warn(err);
        }
        // Recalculate --vh after fullscreen
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        }, 300);
        setShowResumePrompt(false);
    };

    return (
        <>
            <Head title={title ? `${title} — Pintar Hijaiyah` : 'Pintar Hijaiyah'}>
                {description ? <meta name="description" content={description} /> : null}
            </Head>

            {showResumePrompt && (
                <div className="fixed inset-0 z-[99999] bg-[#0b1147]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white/10 p-8 rounded-3xl border border-white/20 flex flex-col items-center max-w-sm w-full shadow-2xl">
                        <h2 className="text-3xl font-black text-white mb-2">Game Jeda</h2>
                        <p className="text-white/80 font-bold mb-8 text-sm">Layar terkunci. Ketuk tombol di bawah untuk melanjutkan belajar!</p>
                        <button 
                            onClick={resumeFullscreen}
                            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl px-10 py-4 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-3 border-4 border-white/20 w-full"
                        >
                            <Play className="fill-white w-6 h-6" /> Lanjutkan
                        </button>
                    </div>
                </div>
            )}

            <div className={`flex flex-col min-h-screen ${customBg && !customBg.startsWith('/') && !customBg.startsWith('http') ? customBg : ''} ${!customBg ? (fantasyBg ? 'learn-fantasy-bg' : 'bg-[#EEF2F6]') : ''}`} style={customBg && (customBg.startsWith('/') || customBg.startsWith('http')) ? { backgroundImage: `url('${customBg}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
                {!noHeader && <AppHeader isStatic={staticHeader} />}

                <main className={`flex-1 w-full ${fullWidth ? 'max-w-full' : fantasyBg ? 'max-w-[1400px]' : 'max-w-2xl'} mx-auto ${noPadding ? '' : 'px-4 lg:px-8 py-8'} ${!noNav ? 'pb-24 md:pb-8' : ''}`}>
                    {children}
                </main>

                {!noNav && <MobileNav />}

                {/* Fantasy BG decorations */}
                {fantasyBg && (
                    <div className="learn-fantasy-decorations pointer-events-none" aria-hidden>
                        {/* Flowers bottom-right */}
                        <div className="absolute bottom-0 right-0 flex gap-1 opacity-80 p-4">
                            <span className="text-3xl">🌸</span>
                            <span className="text-2xl mt-3">🌺</span>
                            <span className="text-3xl mt-1">🌷</span>
                        </div>
                        {/* Flowers bottom-left */}
                        <div className="absolute bottom-0 left-0 flex gap-1 opacity-70 p-4">
                            <span className="text-2xl mt-2">🌻</span>
                            <span className="text-3xl">🌼</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
