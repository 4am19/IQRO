import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Global Background Music Manager
 * 
 * Uses HTML5 Audio with Sunlight_on_the_Pages.mp3
 * Persists mute state in localStorage.
 */

interface BGMContextType {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    toggle: () => void;
    setVolume: (val: number) => void;
}

export const BGMContext = createContext<BGMContextType>({
    isPlaying: false,
    isMuted: true,
    volume: 0.4,
    toggle: () => {},
    setVolume: () => {},
});

export function useBGM() {
    return useContext(BGMContext);
}

export function BGMProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('bgm_muted') !== 'false';
    });
    const [volume, setVolumeState] = useState(() => {
        if (typeof window === 'undefined') return 0.4;
        const stored = localStorage.getItem('bgm_volume');
        return stored ? parseFloat(stored) : 0.4;
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio object once
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const audio = new Audio('/audio/Sunlight_on_the_Pages.mp3');
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;
        
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    const startMusic = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(err => {
            console.warn('BGM failed to start (user might not have interacted yet):', err);
        });
    }, []);

    const stopMusic = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    }, []);

    const toggle = useCallback(() => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('bgm_muted', String(newMuted));

        if (newMuted) {
            stopMusic();
        } else {
            startMusic();
        }
    }, [isMuted, startMusic, stopMusic]);

    const setVolume = useCallback((val: number) => {
        setVolumeState(val);
        localStorage.setItem('bgm_volume', val.toString());
    }, []);

    // Sync HTML5 audio muted and volume properties
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Auto-start if not muted (after user interaction)
    useEffect(() => {
        if (isMuted) return;

        const handleInteraction = () => {
            startMusic();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });

        // Try playing immediately just in case interaction already happened
        startMusic();

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [isMuted, startMusic]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopMusic();
        };
    }, [stopMusic]);

    // Pause/resume when tab hidden/visible
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') {
                if (isPlaying) stopMusic();
            } else if (document.visibilityState === 'visible') {
                if (!isMuted && !isPlaying) startMusic();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isPlaying, isMuted, startMusic, stopMusic]);

    return (
        <BGMContext.Provider value={{ isPlaying, isMuted, volume, toggle, setVolume }}>
            {children}
        </BGMContext.Provider>
    );
}
