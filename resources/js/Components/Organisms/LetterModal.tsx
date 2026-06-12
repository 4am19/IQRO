import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HarakatEntry {
    latin: string;
    arabic: string;
}

interface LetterData {
    id: number;
    char_arabic: string;
    name: string;
    read_latin: string;
    pronunciation_desc?: string;
    fathah?: HarakatEntry;
    kasrah?: HarakatEntry;
    dhammah?: HarakatEntry;
}

interface LetterModalProps {
    letter: LetterData | null;
    onClose: () => void;
    onPlayAudio: (char: string) => void;
}

const harakatList = [
    { key: 'fathah',  label: 'Fathah',  color: 'bg-ocean-50 border-ocean-200 text-ocean-700' },
    { key: 'kasrah',  label: 'Kasrah',  color: 'bg-grape-50 border-grape-200 text-grape-700' },
    { key: 'dhammah', label: 'Dammah', color: 'bg-sunshine-50 border-sunshine-200 text-sunshine-700' },
] as const;

export default function LetterModal({ letter, onClose, onPlayAudio }: LetterModalProps) {
    if (!letter) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring' as const, damping: 28, stiffness: 300 }}
                    className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] p-6 md:p-8 w-full max-w-md relative shadow-2xl z-10 border-t-4 sm:border-4 border-primary-100"
                >
                    {/* Drag handle (mobile) */}
                    <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 p-2 rounded-full transition-colors"
                    >
                        <X size={22} strokeWidth={3} />
                    </button>

                    <div className="flex flex-col items-center text-center mt-2">
                        {/* Big Arabic char */}
                        <div className="w-28 h-28 bg-primary-100 rounded-full flex items-center justify-center mb-4 border-4 border-primary-200">
                            <span className="text-6xl font-arabic text-primary-700">{letter.char_arabic}</span>
                        </div>

                        <h3 className="text-3xl font-black text-gray-800 mb-1">{letter.name}</h3>
                        <p className="text-ocean-600 font-bold text-base mb-4 bg-ocean-50 px-4 py-1 rounded-full">
                            Dibaca: "{letter.read_latin}"
                        </p>

                        {/* Pronunciation */}
                        {letter.pronunciation_desc && (
                            <div className="bg-amber-50 p-3 rounded-2xl mb-4 w-full text-left border-2 border-amber-100 relative">
                                <div className="absolute -top-3 left-3 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                                    Cara Baca
                                </div>
                                <p className="text-gray-700 font-medium leading-relaxed pt-1 text-sm">
                                    {letter.pronunciation_desc}
                                </p>
                            </div>
                        )}

                        {/* Harakat Table */}
                        {(letter.fathah || letter.kasrah || letter.dhammah) && (
                            <div className="w-full mb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Dengan Harakat</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {harakatList.map(({ key, label, color }) => {
                                        const entry = letter[key];
                                        if (!entry) return null;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => onPlayAudio(entry.arabic)}
                                                className={`flex flex-col items-center p-2.5 rounded-2xl border-2 ${color} hover:scale-105 transition-transform active:scale-95`}
                                            >
                                                <span className="text-3xl font-arabic mb-1">{entry.arabic}</span>
                                                <span className="text-xs font-bold">{label}</span>
                                                <span className="text-sm font-black">{entry.latin}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Audio button */}
                        <button
                            onClick={() => onPlayAudio(letter.char_arabic)}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Volume2 size={22} />
                            Dengarkan Pengucapan
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
