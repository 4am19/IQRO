import React from 'react';
import { motion } from 'framer-motion';

interface GameBoardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function GameBoard({ title, subtitle, children }: GameBoardProps) {
    return (
        <div className="max-w-3xl mx-auto w-full">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] shadow-card border-b-4 border-gray-200 mb-8 text-center"
            >
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">{title}</h2>
                {subtitle && (
                    <p className="text-gray-500 font-medium">{subtitle}</p>
                )}
            </motion.div>

            <div className="game-container">
                {children}
            </div>
        </div>
    );
}
