import Button from '@/components/ui/button'

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for small retailers getting started",
      features: [
        "Basic risk tracking",
        "1 property",
        "Monthly reports",
        "Mobile app access",
        "Email support"
      ],
      limitations: [
        "Insurance insights",
        "Premium optimization"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional", 
      price: "£29",
      period: "/month",
      description: "Ideal for growing retail chains",
      features: [
        "Complete risk management",
        "2+ properties",
        "Real-time analytics", 
        "Insurance insights",
        "Premium optimisation",
        "Priority support"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large retail operations",
      features: [
        "Unlimited properties",
        "Custom integrations",
        "Dedicated support",
        "Custom reporting", 
        "API access",
        "White-label options"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section className="py-20 bg-slate-50" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate-600">
            Choose the plan that fits your business needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600 text-lg">{plan.period}</span>
                </div>
                <p className="text-slate-600">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, limitationIndex) => (
                  <li key={limitationIndex} className="flex items-center gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-slate-400">{limitation}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : ''
                }`}
                variant={plan.popular ? 'primary' : 'outline'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
