import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const StarCanvas = dynamic(() => import("@/components/ui/StarCanvas"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/ui/Navbar"), {
  ssr: false,
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Mithran Ezhilarasan — Data Engineer",
  description:
    "Data Engineer building production-grade pipelines, streaming platforms, and AI-powered data systems. MS Information Systems @ Northeastern University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-bg text-text-primary`}
      >
        <SmoothScrollProvider>
          {/* Star canvas — fixed behind everything */}
          <StarCanvas />

          {/* Persistent UI */}
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <NoiseOverlay />

          {/* Cinematic scanline */}
          <div className="scanline" />

          {/* Page content */}
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
