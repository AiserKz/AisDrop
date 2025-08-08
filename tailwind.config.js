import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                grotesk: ['"Space Grotesk"', 'Noto Sans', 'sans-serif'],
            },
            colors: {
                bgDark: '#121216',
                bgBlock: '#2c2c35',
                textMuted: '#a2a2b3',
                accent: '#b2b2e5',
            },
            keyframes: {
                pop: {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.4)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                pop: 'pop 0.3s ease-in-out',
            },
        },
    },

    plugins: [forms],
};
