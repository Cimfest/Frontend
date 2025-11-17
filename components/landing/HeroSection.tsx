'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Turn Your Voice Into
            <span className="text-primary"> Studio Magic</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Unleash the power of AI to transform your raw vocals into professional, 
            radio-ready tracks. From bedroom recordings to Billboard potential in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/Login">Start Creating Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}