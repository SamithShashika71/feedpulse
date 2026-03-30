import './globals.css';

export const metadata = {
  title: 'FeedPulse — AI Powered Feedback',
  description: 'Collect, analyze, and prioritize product feedback with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}