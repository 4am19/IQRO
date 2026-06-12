import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'primary' | 'ocean' | 'sunshine' | 'grape';
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
    const gradients = {
        primary: 'from-primary-400 to-primary-600',
        ocean: 'from-ocean-400 to-ocean-600',
        sunshine: 'from-sunshine-400 to-sunshine-600',
        grape: 'from-grape-400 to-grape-600',
    };

    const textColors = {
        primary: 'text-primary-100',
        ocean: 'text-ocean-100',
        sunshine: 'text-sunshine-100',
        grape: 'text-grape-100',
    };

    const iconColors = {
        primary: 'text-primary-200',
        ocean: 'text-ocean-200',
        sunshine: 'text-sunshine-200',
        grape: 'text-grape-200',
    };

    return (
        <div className={`stat-card bg-gradient-to-br ${gradients[color]} flex items-center justify-between`}>
            <div className="z-10">
                <p className={`${textColors[color]} font-medium mb-1`}>{title}</p>
                <h3 className="text-5xl font-black drop-shadow-sm">{value}</h3>
            </div>
            <div className={`z-10 opacity-80 ${iconColors[color]}`}>
                {icon}
            </div>
        </div>
    );
}
