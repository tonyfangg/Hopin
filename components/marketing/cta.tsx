import Button from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Ready to reduce your insurance costs?
        </h2>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          Join hundreds of retailers saving thousands on premiums while improving safety standards
        </p>
        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 mb-6">
          Start Your Free Trial Today
        </Button>
        <div className="text-sm opacity-75">
          No credit card required • 30-day free trial • Cancel anytime
        </div>
      </div>
    </section>
  )
}