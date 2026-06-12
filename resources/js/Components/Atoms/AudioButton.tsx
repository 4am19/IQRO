import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioButtonProps {
    onClick: (e: React.MouseEvent) => void;
    className?: string;
    size?: number;
    isPlaying?: boolean;
}

export default function AudioButton({ onClick, className = '', size = 24, isPlaying = false }: AudioButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
            className={`flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 p-2 shadow-sm hover:bg-emerald-200 hover:text-emerald-700 transition-colors ${isPlaying ? 'animate-pulse bg-emerald-200' : ''} ${className}`}
            aria-label="Dengarkan suara"
        >
            <Volume2 size={size} />
        </motion.button>
    );
}
