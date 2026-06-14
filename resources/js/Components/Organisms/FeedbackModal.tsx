import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    feedback: 'correct' | 'wrong' | null;
    explanation?: string;
}

export default function FeedbackModal({ feedback, explanation }: Props) {
    return (
        <AnimatePresence>
            {feedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" 
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: 50, scale: 0.9, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 50, scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        className={`relative w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-[32px] shadow-2xl flex flex-col items-center text-center z-10 pointer-events-auto
                            ${feedback === 'correct' ? 'bg-gradient-to-b from-emerald-50 to-emerald-100 border-4 border-emerald-300' 
                            : 'bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300'}`}
                    >
                        <motion.img 
                            initial={{ y: 20 }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            src={feedback === 'correct' ? '/images/maskod/jawaban-benar.png' : '/images/maskod/jawaban-salah.png'} 
                            alt={feedback} 
                            className="w-40 h-40 sm:w-48 sm:h-48 object-contain -mt-24 mb-4 drop-shadow-xl"
                        />
                        
                        <h2 className={`text-2xl sm:text-3xl font-black mb-2 
                            ${feedback === 'correct' ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {feedback === 'correct' ? 'Benar Sekali!' : 'Oops, Hampir!'}
                        </h2>
                        
                        <p className={`text-sm sm:text-base font-bold 
                            ${feedback === 'correct' ? 'text-emerald-600' : 'text-amber-700'}`}>
                            {explanation || (feedback === 'correct' ? 'Kamu hebat! Ayo lanjutkan semangat belajarmu!' : 'Jangan menyerah, ayo coba lagi ya!')}
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
