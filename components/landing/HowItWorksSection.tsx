import { Upload, Music, Globe } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Voice',
      description: 'Simply record or upload your vocal track. No expensive equipment needed.',
      color: 'bg-[#fbbf24]'
    },
    {
      icon: Music,
      title: 'AI-Powered Production',
      description: 'Our AI analyzes and enhances your voice, creates beats, and adds professional touches to your performance.',
      color: 'bg-[#fbbf24]'
    },
    {
      icon: Globe,
      title: 'Export to the World',
      description: 'Download your polished track in multiple formats, optimized and ready for Spotify and other platforms.',
      color: 'bg-[#fbbf24]'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f1229]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your voice into professional music
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center`}>
                  <step.icon className="w-10 h-10 text-[#0a0e27]" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}