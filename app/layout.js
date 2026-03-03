import './globals.css';

export const metadata = {
  title: 'Teams Fun Hub',
  description: 'Microsoft Teams-inspired office entertainment with text-based games.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
