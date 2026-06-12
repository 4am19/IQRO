import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreBarProps {
    score: number;
    lives?: number;
    maxLives?: number;
    currentQuestion: number;
    totalQuestions: number;
}

export default function ScoreBar({ score, lives, maxLives = 3, currentQuestion, totalQuestions }: ScoreBarProps) {
    const progressPercentage = ((currentQuestion - 1) / totalQuestions) * 100;

    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Progress Questions */}
            <div className="w-full md:w-1/3">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-1">
                    <span>Soal {currentQuestion} dari {totalQuestions}</span>
                </div>
                <div className="progress-bar bg-gray-100">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Score & Lives */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-sunshine-50 px-4 py-2 rounded-2xl border-2 border-sunshine-200">
                    <span className="text-sunshine-600 font-bold">Skor</span>
                    <motion.span 
                        key={score}
                        initial={{ scale: 1.5, color: '#f59e0b' }}
                        animate={{ scale: 1, color: '#d97706' }}
                        className="text-2xl font-black text-sunshine-600"
                    >
                        {score}
                    </motion.span>
                </div>

                {lives !== undefined && (
                    <div className="flex gap-1">
                        {Array.from({ length: maxLives }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={false}
                                animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                            >
                                <Heart 
                                    className={`w-8 h-8 ${i < lives ? 'fill-rose-500 text-rose-500' : 'fill-gray-200 text-gray-300'}`} 
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
