'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Amman Dake',
      avatar: 'AD',
      text: 'I went from humming melodies to having a complete album in just two weeks. This platform is revolutionary.'
    },
    {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      text: 'The AI production quality is incredible. My tracks sound like they were recorded in a professional studio.'
    },
    {
      name: 'Michael Chen',
      avatar: 'MC',
      text: 'This tool has democratized music production. Anyone with a voice can now create professional music.'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Artists Say</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of creators who've transformed their music
          </p>
        </div>

        <div className="relative">
          <Card className="bg-card border-border">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {testimonials[currentIndex].avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {testimonials[currentIndex].name}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}