import React from 'react';

export interface LetterData {
    id: number;
    char_arabic: string;
    name: string;
    read_latin: string;
    pronunciation_desc?: string;
    fathah?: { latin: string; arabic: string };
    kasrah?: { latin: string; arabic: string };
    dhammah?: { latin: string; arabic: string };
}

interface LetterCardProps {
    letter: LetterData;
    onClick: (letter: LetterData) => void;
    isActive?: boolean;
    className?: string;
}

export default function LetterCard({ letter, onClick, isActive = false, className = '' }: LetterCardProps) {
    return (
        <button
            onClick={() => onClick(letter)}
            className={`letter-card ${isActive ? 'active' : ''} ${className}`}
        >
            <span className="text-5xl md:text-6xl font-arabic text-primary-800 mb-2">
                {letter.char_arabic}
            </span>
            <span className="text-sm md:text-base font-bold text-gray-600">
                {letter.name}
            </span>
        </button>
    );
}
