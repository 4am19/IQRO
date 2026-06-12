import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
    score: number;
    maxScore?: number;
    className?: string;
    size?: number;
}

export default function StarRating({ score, maxScore = 100, className = '', size = 24 }: StarRatingProps) {
    // Menghitung berapa bintang yang didapat (skala 1-3)
    const percentage = (score / maxScore) * 100;
    let stars = 0;
    
    if (percentage >= 80) stars = 3;
    else if (percentage >= 50) stars = 2;
    else if (percentage > 0) stars = 1;

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[1, 2, 3].map((index) => (
                <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
                >
                    <Star
                        size={size}
                        className={`${
                            index <= stars
                                ? 'fill-yellow-400 text-yellow-500'
                                : 'fill-gray-200 text-gray-300'
                        }`}
                    />
                </motion.div>
            ))}
        </div>
    );
}
