import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Create Your Next Hit?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of artists who are already creating professional music with AI. 
            Start your journey today.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/Login">Start Creating Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}