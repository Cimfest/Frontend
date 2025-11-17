'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Turn Your Voice Into
            <span className="text-[#fbbf24]"> Studio Magic</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
            Unleash the power of AI to transform your raw vocals into professional, 
            radio-ready tracks. From bedroom recordings to Billboard potential in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/create"
              className="px-8 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0a0e27] font-semibold rounded-lg transition-colors text-lg"
            >
              Start Creating Now
            </Link>
            <Link
              href="#demo"
              className="px-8 py-3 border-2 border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-[#0a0e27] font-semibold rounded-lg transition-colors text-lg"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}