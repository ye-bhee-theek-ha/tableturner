/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'Display': ['"Oxygen Mono"', 'serif'],
        creato: ['Creato Display', 'sans-serif'],

      },
      colors: {
        "lime": "#D2FF00",
        "orange": "#B26F4D",
        "lorange": "#D6C9C2",
        "lgreen": "#E6E8E3",
        "green": "#C9D6C2",
        "green_nav": "#aec2a4",
        "dgreen": "#779966",
        "lpink": "#D6C9C2",
        "pink": "#CAAC9C",
        "offwhite": "#F5F6F3",
        "grey": "#D9D9D9"
      },
      fontSize: {
        'hero': '68px',
        'heading': '44px',
        'subheading': '36px',
        "cardtitle": "40px",
        "profilehead": "30px",
        'text': '20px',
        'btn': '18px',
        "blog_btn": "24px",
        "tag_btn": "18px"

      }
    },
  },
  plugins: [],
}

