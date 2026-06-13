import { useCallback, useRef } from 'react';

// Global audio cache to prevent re-fetching and eliminate playback delay
const audioCache = new Map<string, HTMLAudioElement>();

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

    const preloadAudio = useCallback((baseLetterArabic: string, type: 'polos' | 'fathah' | 'kasrah' | 'dhammah' = 'polos') => {
        let folderPath = '/audio/';
        if (type === 'fathah') folderPath = '/audio/fathah/';
        else if (type === 'kasrah') folderPath = '/audio/kasroh/';
        else if (type === 'dhammah') folderPath = '/audio/dammah/';
        
        let fileName = `${baseLetterArabic}.m4a`;
        if (type === 'polos' && baseLetterArabic === 'ك') {
            fileName = 'ك.mpeg';
        } else if (type === 'fathah' && (baseLetterArabic === 'ط' || baseLetterArabic === 'ك')) {
            fileName = `${baseLetterArabic}.mpeg`;
        } else if (type === 'kasrah' && baseLetterArabic === 'ظ') {
            fileName = 'ظ dhi.m4a';
        }

        const audioPath = `${folderPath}${fileName}`;
        
        if (!audioCache.has(audioPath)) {
            const audio = new Audio(audioPath);
            audio.preload = 'auto'; // Instruct browser to preload audio data
            audioCache.set(audioPath, audio);
        }
        
        return audioPath;
    }, []);

    const playAudio = useCallback((textToSpeak: string, baseLetterArabic?: string, type: 'polos' | 'fathah' | 'kasrah' | 'dhammah' = 'polos') => {
        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (baseLetterArabic) {
            const audioPath = preloadAudio(baseLetterArabic, type);
            const audio = audioCache.get(audioPath)!;
            
            // Reset playback time for immediate play
            audio.currentTime = 0;
            
            audio.play().catch(() => {
                // Fallback to TTS if file not found or browser blocked it
                playTTS(textToSpeak);
            });
            audioRef.current = audio;
        } else {
            playTTS(textToSpeak);
        }
    }, [preloadAudio]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    return { playAudio, stopAudio, preloadAudio };
}
