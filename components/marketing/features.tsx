export function Features() {
    const features = [
      {
        icon: "🛡️",
        title: "Comprehensive Risk Tracking",
        description: "Monitor fire safety, security, maintenance, electrical systems, plumbing, and staff safety across all your retail locations in real-time.",
        gradient: "from-blue-500 to-blue-600"
      },
      {
        icon: "📊", 
        title: "Intelligent Analytics",
        description: "Advanced algorithms convert your safety data into actionable insights and insurance risk scores that directly impact your premiums.",
        gradient: "from-purple-500 to-purple-600"
      },
      {
        icon: "💰",
        title: "Insurance Optimization", 
        description: "Automatically calculate potential savings and receive personalized recommendations to maximize your insurance cost reductions.",
        gradient: "from-green-500 to-green-600"
      },
      {
        icon: "📱",
        title: "Mobile-First Platform",
        description: "Manage safety tasks, log incidents, and monitor risk scores from anywhere with our intuitive mobile application designed for busy retailers.",
        gradient: "from-orange-500 to-orange-600"
      }
    ]
  
    return (
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Everything you need to optimize risk
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive tools designed for modern retail operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }