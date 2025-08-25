import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       zIndex: {
//         '-1': '-1',
//       },
//       maxWidth: {
//         '8xl': '1440px',   // Optional: wider than 7xl
//         'fluid': '100%',   // Optional: stretch full width
//       },
//     },
//   },
//   plugins: [],
// }