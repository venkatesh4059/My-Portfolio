import './globals.css';

export const metadata = {
  title: 'Portfolio — Creative Developer',
  description: 'Immersive cinematic portfolio experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
