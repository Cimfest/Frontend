import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0e27] mb-6">
            Ready to Create Your Next Hit?
          </h2>
          <p className="text-lg md:text-xl text-[#0a0e27]/80 mb-8 max-w-2xl mx-auto">
            Join thousands of artists who are already creating professional music with AI. 
            Start your journey today.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-[#0a0e27] hover:bg-[#0f1229] text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Start Creating Now
          </Link>
        </div>
      </div>
    </section>
  )
}