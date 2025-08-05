import { NextRequest, NextResponse } from 'next/server'

// Fallback endpoint that returns mock data when authentication fails
export async function GET(request: NextRequest) {
  // Return mock electrical reports data for testing
  const mockData = [
    {
      id: '1',
      property_id: 'mock-property-1',
      inspector_name: 'John Smith',
      inspection_date: new Date().toISOString(),
      inspection_type: 'PAT Testing',
      compliance_status: 'compliant',
      safety_score: 95,
      risk_rating: 2,
      issues_found: [],
      recommendations: ['Maintain current safety standards'],
      remedial_work_required: false,
      next_inspection_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2', 
      property_id: 'mock-property-2',
      inspector_name: 'Sarah Jones',
      inspection_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      inspection_type: 'Fixed Wire Testing',
      compliance_status: 'pending',
      safety_score: 88,
      risk_rating: 3,
      issues_found: ['Minor wiring concern in basement'],
      recommendations: ['Schedule rewiring for basement area'],
      remedial_work_required: true,
      next_inspection_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  return NextResponse.json({
    success: true,
    data: mockData,
    message: 'Mock data - authentication bypass for testing'
  })
}