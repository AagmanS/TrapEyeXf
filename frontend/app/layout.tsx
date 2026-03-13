import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: 'TrapEye — AI Cybersecurity Platform',
  description:
    'TrapEye is an AI-powered cybersecurity platform detecting phishing URLs, fake news, and deepfake media using machine learning and Gemini multimodal AI.',
  keywords: 'cybersecurity, phishing detection, fake news, deepfake, AI security, scam detection',
  openGraph: {
    title: 'TrapEye — AI Cybersecurity Platform',
    description: 'Real-time threat detection powered by AI and machine learning',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-[#0A0A0A] overflow-x-hidden text-[#F5F5F0]`}>
        {children}
      </body>
    </html>
  );
}
