import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                arabic: ['Amiri', 'Traditional Arabic', 'serif'],
            },
            colors: {
                // Primary (indigo-based untuk desain baru)
                primary: {
                    50:  '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // Ocean (sky blue)
                ocean: {
                    50:  '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                },
                // Sunshine (amber/yellow)
                sunshine: {
                    50:  '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                // Candy (pink)
                candy: {
                    50:  '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                },
                // Grape (purple)
                grape: {
                    50:  '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                },
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            animation: {
                'bounce-slow': 'bounce 2.5s infinite',
                'float':       'float 3s ease-in-out infinite',
                'float-owl':   'float-owl 3.5s ease-in-out infinite',
                'spin-slow':   'spin 6s linear infinite',
                'wiggle':      'wiggle 1s ease-in-out infinite',
                'pulse-slow':  'pulse 3s infinite',
                'pop':         'pop 0.3s cubic-bezier(0.68,-0.55,0.265,1.55)',
                'shake':       'shake 0.5s ease-in-out',
                'fade-in':     'fadeIn 0.4s ease-out',
                'slide-up':    'slideUp 0.4s ease-out',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%':     { transform: 'translateY(-10px)' },
                },
                'float-owl': {
                    '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
                    '50%':     { transform: 'translateY(-14px) rotate(2deg)' },
                },
                wiggle: {
                    '0%,100%': { transform: 'rotate(-3deg)' },
                    '50%':     { transform: 'rotate(3deg)' },
                },
                pop: {
                    '0%':   { transform: 'scale(0)' },
                    '50%':  { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                },
                shake: {
                    '0%,100%':              { transform: 'translateX(0)' },
                    '10%,30%,50%,70%,90%': { transform: 'translateX(-4px)' },
                    '20%,40%,60%,80%':     { transform: 'translateX(4px)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%':   { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)',    opacity: '1' },
                },
            },
            boxShadow: {
                'card':      '0 2px 12px rgba(0,0,0,0.06)',
                'card-hover':'0 8px 24px rgba(0,0,0,0.12)',
                'fun':       '0 4px 14px rgba(99,102,241,0.25)',
                'fun-lg':    '0 10px 25px rgba(99,102,241,0.3)',
            },
        },
    },

    plugins: [forms],
};
