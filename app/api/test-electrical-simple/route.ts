import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 Simple electrical test endpoint called')
  
  const mockData = [
    {
      id: '1',
      property_id: 'test-property-1',
      inspector_name: 'Test Inspector',
      inspection_date: new Date().toISOString(),
      inspection_type: 'PAT Testing',
      compliance_status: 'compliant',
      safety_score: 95,
      risk_rating: 2,
      issues_found: [],
      recommendations: ['Test recommendation'],
      remedial_work_required: false,
      next_inspection_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: { name: 'Test Property', address: 'Test Address' }
    }
  ]

  return NextResponse.json({ 
    success: true, 
    data: mockData,
    timestamp: new Date().toISOString(),
    message: 'Test electrical endpoint working'
  })
}