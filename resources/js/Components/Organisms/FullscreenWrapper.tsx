import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

export default function FullscreenWrapper({ children }: Props) {
    const [showResumePrompt, setShowResumePrompt] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Cek jika device adalah mobile/tablet
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
        if (!isMobile) return;

        const checkFs = () => {
            const isFs = document.fullscreenElement || (document as any).webkitFullscreenElement;
            if (!isFs) {
                setShowResumePrompt(true);
            } else {
                setShowResumePrompt(false);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setTimeout(() => {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', vh + 'px');
                    checkFs();
                }, 200);
            }
        };

        const handleResize = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
            checkFs();
        };

        document.addEventListener('fullscreenchange', checkFs);
        document.addEventListener('webkitfullscreenchange', checkFs);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);

        // Initial check
        setTimeout(checkFs, 500);

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
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        }, 300);
        setShowResumePrompt(false);
    };

    return (
        <>
            {showResumePrompt && (
                <div className="fixed inset-0 z-[99999] bg-[#0b1147]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white/10 p-8 rounded-3xl border border-white/20 flex flex-col items-center max-w-sm w-full shadow-2xl">
                        <h2 className="text-3xl font-black text-white mb-2">Game Jeda</h2>
                        <p className="text-white/80 font-bold mb-8 text-sm">Layar terkunci atau Anda keluar jendela. Ketuk tombol di bawah untuk masuk ke mode Layar Penuh dan melanjutkan belajar!</p>
                        <button 
                            onClick={resumeFullscreen}
                            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl px-10 py-4 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-3 border-4 border-white/20 w-full"
                        >
                            <Play className="fill-white w-6 h-6" /> Lanjutkan
                        </button>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
