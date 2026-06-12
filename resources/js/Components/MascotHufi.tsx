import React from 'react';

interface Props {
    pose?: 'happy' | 'wave' | 'winking';
    className?: string;
}

/**
 * Maskot Hufi — Image version using sprites from public/images/maskod
 */
export default function MascotHufi({ pose = 'happy', className = 'w-24 h-24' }: Props) {
    // Map poses to specific sprite images
    const getSpriteForPose = (pose: string) => {
        switch (pose) {
            case 'happy':
                return '/images/maskod/sprite_01.png';
            case 'wave':
                return '/images/maskod/sprite_02.png';
            case 'winking':
                return '/images/maskod/sprite_03.png';
            default:
                return '/images/maskod/sprite_01.png';
        }
    };

    return (
        <img
            src={getSpriteForPose(pose)}
            alt="Maskot Hufi"
            className={`drop-shadow-lg select-none transition-transform duration-300 object-contain ${className}`}
            draggable={false}
        />
    );
}
