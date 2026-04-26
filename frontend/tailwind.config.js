/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'forest': '#2D5A27',
                'sage': '#A3B18A',
                'earth': '#F9F7F2',
            }
        },
    },
    plugins: [],
}