/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // App Basic Colors
        primary: "#1672EC", // Blue
        secondary: "#7C84A3", // Muted Purple
        accent: "#E1EDFB", // Light Blue
        error: "#FF4D4F", // Red
        success: "#4CAF50", // Green

        lightSuccess: "#E8F5E9", // Light Green
        lightError: "#FFEBEE", // Light Red
        
        // Text Colors
        "text-primary": "#404454", // Dark Grey
        "text-secondary": "#6C757D",
        "text-white": "#FFFFFF",
        
        // Background Colors
        light: "#E1EDFB", // Light Blue
        dark: "#404454", // Dark Grey
        "primary-bg": "#F3F5FF",
        
        // Container Colors
        "light-container": "#E1EDFB", // Light Blue
        // Note: dark-container uses opacity, handled via opacity utilities in Tailwind
        
        // Button Colors
        "button-primary": "#1672EC", // Blue
        "button-secondary": "#7C84A3", // Muted Purple
        "button-disabled": "#404454"
      }
    },
  },
  plugins: [],
}