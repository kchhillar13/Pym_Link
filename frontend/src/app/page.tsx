"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Step 1: Deep Space Canvas */}
      <div className="space-canvas" />
      <div className="mesh-pattern" />

      {/* Step 2: The Header */}
      <header className="px-6 h-20 flex items-center justify-between z-10">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="transition-opacity hover:opacity-80">
          <span className="text-2xl font-bold tracking-tight glow-text-purple">Pym-Link</span>
        </Link>
        <nav className="flex gap-6">
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-lavender hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-muted-lavender hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium text-muted-lavender hover:text-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10">
        <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8">
          
          {/* Step 3: Central Project Core Icon (Icosahedron Wireframe) */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <defs>
                <linearGradient id="icon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#icon-grad)" strokeWidth="0.5" strokeLinejoin="round">
                {/* Complex Icosahedron Wireframe */}
                <polygon points="50,5 90,35 75,85 25,85 10,35" />
                <path d="M50,5 L75,85 M50,5 L25,85 M10,35 L90,35 M10,35 L75,85 M90,35 L25,85" />
                <path d="M50,5 L50,45 M10,35 L50,45 M90,35 L50,45 M25,85 L50,45 M75,85 L50,45" />
                <path d="M50,45 L50,95 M25,85 L50,95 M75,85 L50,95" />
                <path d="M10,35 L25,85 M90,35 L75,85" />
              </g>
            </svg>
          </div>

          {/* Step 4: Main Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight glow-text-lavender">
              Structured Project Link Management
            </h1>
            <div className="space-y-1">
              <p className="text-lg md:text-xl text-grey-blue">
                Shorten, organize, and secure your project links with namespaced routing. Perfect for portfolios
              </p>
              <p className="text-lg md:text-xl text-grey-blue">
                Perfect for portfolios and private vaulting.
              </p>
            </div>
          </div>

          {/* Step 5: 'Go to Dashboard' Button */}
          <div>
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="inline-flex h-12 items-center justify-center px-8 rounded-lg btn-gradient text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </main>

      {/* Step 6: The Footer and Fine Print */}
      <footer className="px-6 py-8 flex items-center justify-between text-[10px] md:text-xs text-grey-blue z-10">
        <div>
          © 2026 Pym-Link. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
