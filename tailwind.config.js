/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'admin-primary': '#1890ff',
        'admin-success': '#52c41a',
        'admin-warning': '#faad14',
        'admin-error': '#ff4d4f',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 与 Ant Design 兼容
  },
}