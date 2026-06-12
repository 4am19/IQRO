import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Global Background Music Manager
 * 
 * Uses a simple procedural lullaby-style melody via Web Audio API
 * so we don't need any external MP3 files.
 * 
 * Persists mute state in localStorage.
 */

interface BGMContextType {
    isPlaying: boolean;
    isMuted: boolean;
    toggle: () => void;
}

const BGMContext = createContext<BGMContextType>({
    isPlaying: false,
    isMuted: true,
    toggle: () => {},
});

export function useBGM() {
    return useContext(BGMContext);
}

// Pentatonic scale frequencies for a kid-friendly feel (C major pentatonic)
const NOTES = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
];

// A gentle, looping melody pattern (indices into NOTES)
const MELODY = [
    0, 2, 4, 5, 4, 2, 3, 1,
    0, 3, 5, 4, 2, 0, 1, 3,
    4, 5, 7, 5, 4, 3, 2, 0,
    2, 4, 3, 1, 0, 2, 4, 5,
];

export function BGMProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('bgm_muted') !== 'false';
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const intervalRef = useRef<number | null>(null);
    const noteIdxRef = useRef(0);

    const startMusic = useCallback(() => {
        if (audioCtxRef.current) return; // already playing

        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = ctx;

            const masterGain = ctx.createGain();
            masterGain.gain.value = 0.08; // Very soft background
            masterGain.connect(ctx.destination);
            gainRef.current = masterGain;

            noteIdxRef.current = 0;

            const playNote = () => {
                if (!audioCtxRef.current) return;
                const ctx = audioCtxRef.current;
                const noteIndex = MELODY[noteIdxRef.current % MELODY.length];
                const freq = NOTES[noteIndex];

                // Main tone (sine - soft and gentle)
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq;

                // Envelope for gentle attack/release
                const env = ctx.createGain();
                env.gain.value = 0;
                env.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05);
                env.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
                env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);

                osc.connect(env);
                env.connect(masterGain!);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.6);

                // Soft harmonic (one octave up, triangle, very quiet)
                const osc2 = ctx.createOscillator();
                osc2.type = 'triangle';
                osc2.frequency.value = freq * 2;

                const env2 = ctx.createGain();
                env2.gain.value = 0;
                env2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.08);
                env2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

                osc2.connect(env2);
                env2.connect(masterGain!);

                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.45);

                noteIdxRef.current++;
            };

            // Play a note every 400ms (gentle tempo ~150 BPM eighth notes)
            playNote();
            intervalRef.current = window.setInterval(playNote, 400);
            setIsPlaying(true);
        } catch (err) {
            console.warn('BGM failed to start:', err);
        }
    }, []);

    const stopMusic = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close().catch(() => {});
            audioCtxRef.current = null;
        }
        gainRef.current = null;
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
        <BGMContext.Provider value={{ isPlaying, isMuted, toggle }}>
            {children}
        </BGMContext.Provider>
    );
}

export { BGMContext };
