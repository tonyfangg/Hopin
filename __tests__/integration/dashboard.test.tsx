import { render, screen, waitFor } from '@testing-library/react'
import ClientDashboardPage from '@/app/dashboard/client-page'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('Dashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock successful API responses
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          properties: 3, 
          overdue_inspections: 0 
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          reports: [
            { overall_condition: 'satisfactory', risk_rating: 2 }
          ]
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          reports: [
            { drainage_condition: 'good', risk_rating: 1 }
          ]
        }),
      })
  })

  it('renders complete dashboard with all sections', async () => {
    render(<ClientDashboardPage />)
    
    // Check main heading
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome to your property management dashboard')).toBeInTheDocument()
    
    // Check dashboard cards
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Active Properties')).toBeInTheDocument()
    
    expect(screen.getByText('Electrical')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
    
    expect(screen.getByText('Drainage')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    
    // Check Recent Activity section
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Risk assessment updated')).toBeInTheDocument()
    expect(screen.getByText('Electrical inspection completed')).toBeInTheDocument()
    expect(screen.getByText('New drainage report submitted')).toBeInTheDocument()
    
    // Check Quick Actions section
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Add Property')).toBeInTheDocument()
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument()
    expect(screen.getByText('New Report')).toBeInTheDocument()
    expect(screen.getByText('Upload Document')).toBeInTheDocument()
  })

  it('loads risk score card data asynchronously', async () => {
    render(<ClientDashboardPage />)
    
    // Initially should show loading state
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Risk Management Score')).toBeInTheDocument()
      expect(screen.getByText('Active Properties')).toBeInTheDocument()
      expect(screen.getByText('Compliance Rate')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('has responsive grid layout', () => {
    render(<ClientDashboardPage />)
    
    // Check main grid container
    const gridContainer = screen.getByText('Properties').closest('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3')
    
    // Check Quick Actions grid
    const quickActionsGrid = screen.getByText('Add Property').closest('.grid')
    expect(quickActionsGrid).toHaveClass('grid-cols-2', 'md:grid-cols-4')
  })

  it('displays correct icons and emojis', () => {
    render(<ClientDashboardPage />)
    
    // Check for emoji icons in cards and sections
    expect(screen.getByText('🏢')).toBeInTheDocument() // Properties
    expect(screen.getByText('⚡')).toBeInTheDocument() // Electrical
    expect(screen.getByText('💧')).toBeInTheDocument() // Drainage
    expect(screen.getByText('📊')).toBeInTheDocument() // Risk Assessment
    expect(screen.getByText('📋')).toBeInTheDocument() // New Report
    expect(screen.getByText('📎')).toBeInTheDocument() // Upload Document
  })

  it('handles API error gracefully', async () => {
    // Mock API failure
    ;(fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<ClientDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Risk Score Unavailable')).toBeInTheDocument()
    })
  })
})