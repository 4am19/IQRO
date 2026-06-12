import { useCallback, useRef } from 'react';

export function useAudioPlayer() {
    const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playTTS = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        ttsRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const playAudio = useCallback((text: string, localAudioName?: string) => {
        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (localAudioName) {
            const fileName = localAudioName.toLowerCase() + '.mp3';
            const audio = new Audio(`/audio/${fileName}`);
            
            audio.play().catch(() => {
                // Fallback to TTS if file not found or browser blocked it
                playTTS(text);
            });
            audioRef.current = audio;
        } else {
            playTTS(text);
        }
    }, []);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    return { playAudio, stopAudio };
}
