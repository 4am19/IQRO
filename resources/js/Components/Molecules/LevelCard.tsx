import React from 'react';
import { Star, Pencil, Trophy, Lock } from 'lucide-react';
import Badge from '../Atoms/Badge';

interface LevelData {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    minimum_passing_score: number;
}

interface LevelCardProps {
    level: LevelData;
    isLocked: boolean;
    highestScore?: number;
    onClick: (levelId: number) => void;
}

export default function LevelCard({ level, isLocked, highestScore, onClick }: LevelCardProps) {
    const icons = {
        star: <Star size={40} />,
        pencil: <Pencil size={40} />,
        trophy: <Trophy size={40} />,
    };

    const colorClasses = {
        ocean: 'border-ocean-200 hover:border-ocean-400',
        grape: 'border-grape-200 hover:border-grape-400',
        sunshine: 'border-sunshine-200 hover:border-sunshine-400',
        primary: 'border-primary-200 hover:border-primary-400',
    };

    const bgClasses = {
        ocean: 'bg-ocean-100 text-ocean-600',
        grape: 'bg-grape-100 text-grape-600',
        sunshine: 'bg-sunshine-100 text-sunshine-600',
        primary: 'bg-primary-100 text-primary-600',
    };

    const borderColor = colorClasses[level.color as keyof typeof colorClasses] || colorClasses.primary;
    const iconBg = bgClasses[level.color as keyof typeof bgClasses] || bgClasses.primary;

    return (
        <button
            disabled={isLocked}
            onClick={() => onClick(level.id)}
            className={`level-card w-full ${borderColor} ${isLocked ? 'locked' : ''} relative overflow-hidden`}
        >
            {isLocked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <div className="bg-gray-800 text-white p-4 rounded-full mb-2">
                        <Lock size={32} />
                    </div>
                    <span className="font-bold text-gray-800">Terkunci</span>
                </div>
            )}

            <div className={`w-20 h-20 ${iconBg} rounded-full flex items-center justify-center mb-4`}>
                {icons[level.icon as keyof typeof icons] || <Star size={40} />}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">{level.title}</h3>
            <p className="text-gray-600 mb-6 flex-grow">{level.description}</p>

            {highestScore !== undefined && highestScore > 0 && (
                <div className="mt-auto pt-4 border-t-2 border-gray-100 w-full">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Skor Tertinggi:</span>
                        <Badge 
                            text={`${highestScore}`} 
                            color={highestScore >= level.minimum_passing_score ? 'primary' : 'sunshine'} 
                        />
                    </div>
                </div>
            )}
        </button>
    );
}
