// =====================================================
// RISK CALCULATION DEMO PAGE
// File: app/demo/risk-calculation/page.tsx
// =====================================================

import { RiskCalculationDashboard } from '@/components/dashboard/risk-calculation'

export default function RiskCalculationDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Risk Calculation System Demo
          </h1>
          <p className="text-slate-600">
            Sophisticated risk assessment dashboard with real-time calculations, historical analysis, and actionable insights.
          </p>
        </div>

        {/* Demo Property Selector */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Demo Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DemoPropertyCard 
              id="demo-property-1"
              name="High Street Retail Store"
              address="123 High Street, London, SW1A 1AA"
              type="Retail"
              riskLevel="HIGH"
            />
            <DemoPropertyCard 
              id="demo-property-2"
              name="Industrial Warehouse"
              address="456 Industrial Estate, Manchester, M1 1AA"
              type="Industrial"
              riskLevel="MEDIUM"
            />
            <DemoPropertyCard 
              id="demo-property-3"
              name="Office Building"
              address="789 Business Park, Birmingham, B1 1AA"
              type="Office"
              riskLevel="LOW"
            />
          </div>
        </div>

        {/* Risk Calculation Dashboard */}
        <RiskCalculationDashboard propertyId="demo-property-1" />

        {/* Feature Overview */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Real-time Risk Calculation"
              description="Dynamic risk assessment using live data from electrical reports, drainage reports, and property details."
              icon="⚡"
            />
            <FeatureCard
              title="Multi-factor Analysis"
              description="Comprehensive risk evaluation across 10 categories including electrical, drainage, security, and compliance."
              icon="📊"
            />
            <FeatureCard
              title="Historical Trends"
              description="Track risk changes over time with visual charts and trend analysis."
              icon="📈"
            />
            <FeatureCard
              title="Actionable Recommendations"
              description="Prioritized action items based on risk impact and improvement opportunities."
              icon="🎯"
            />
            <FeatureCard
              title="Advanced Controls"
              description="Manual overrides and risk simulation for scenario planning and what-if analysis."
              icon="🎛️"
            />
            <FeatureCard
              title="British Standards"
              description="UK-specific risk factors, compliance requirements, and British English terminology."
              icon="🇬🇧"
            />
          </div>
        </div>

        {/* API Integration Info */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">API Integration</h3>
          <p className="text-blue-800 mb-4">
            This dashboard integrates with the sophisticated risk calculation API endpoints:
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <div>• <code className="bg-blue-100 px-2 py-1 rounded">POST /api/risk-calculation</code> - Main risk calculation operations</div>
            <div>• <code className="bg-blue-100 px-2 py-1 rounded">GET /api/properties/[id]/risk</code> - Property risk dashboard data</div>
            <div>• <code className="bg-blue-100 px-2 py-1 rounded">GET /api/organisations/[id]/risk</code> - Organisation risk analysis</div>
            <div>• <code className="bg-blue-100 px-2 py-1 rounded">GET /api/test-risk-calculation</code> - System integration testing</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Demo Property Card Component
function DemoPropertyCard({ 
  id, 
  name, 
  address, 
  type, 
  riskLevel 
}: { 
  id: string
  name: string
  address: string
  type: string
  riskLevel: string 
}) {
  const riskColors = {
    LOW: 'text-green-600 bg-green-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    HIGH: 'text-orange-600 bg-orange-100',
    CRITICAL: 'text-red-600 bg-red-100'
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-600">{address}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${riskColors[riskLevel as keyof typeof riskColors]}`}>
          {riskLevel}
        </div>
      </div>
      <div className="text-xs text-slate-500">
        Type: {type} | ID: {id}
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string
  description: string
  icon: string 
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
} 