'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Amman Dake',
      avatar: 'AD',
      text: 'I went from humming melodies to having a complete album in just two weeks. This platform is revolutionary.',
      bgColor: 'bg-emerald-500'
    },
    {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      text: 'The AI production quality is incredible. My tracks sound like they were recorded in a professional studio.',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Michael Chen',
      avatar: 'MC',
      text: 'This tool has democratized music production. Anyone with a voice can now create professional music.',
      bgColor: 'bg-purple-500'
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Artists Say</h2>
          <p className="text-gray-400 text-lg">
            Join thousands of creators who've transformed their music
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="bg-[#1a1f3a] rounded-2xl p-8 md:p-12 border border-[#2d3554]">
            <div className="flex items-start space-x-4 mb-6">
              <div className={`w-12 h-12 ${testimonials[currentIndex].bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {testimonials[currentIndex].name}
                </h3>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-[#1a1f3a] border border-[#2d3554] flex items-center justify-center hover:bg-[#2d3554] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-[#fbbf24]' : 'bg-[#2d3554]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-[#1a1f3a] border border-[#2d3554] flex items-center justify-center hover:bg-[#2d3554] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}