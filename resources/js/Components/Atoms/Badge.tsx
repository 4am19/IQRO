import React from 'react';

interface BadgeProps {
    text: string;
    color?: 'primary' | 'ocean' | 'sunshine' | 'candy' | 'grape' | 'gray';
    className?: string;
    icon?: React.ReactNode;
}

export default function Badge({ text, color = 'primary', className = '', icon }: BadgeProps) {
    const colorClasses = {
        primary: 'bg-primary-100 text-primary-700 border-primary-200',
        ocean: 'bg-ocean-100 text-ocean-700 border-ocean-200',
        sunshine: 'bg-sunshine-100 text-sunshine-800 border-sunshine-200',
        candy: 'bg-candy-100 text-candy-700 border-candy-200',
        grape: 'bg-grape-100 text-grape-700 border-grape-200',
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border-2 ${colorClasses[color]} ${className}`}>
            {icon && <span className="opacity-70">{icon}</span>}
            {text}
        </span>
    );
}
