import { render, screen, waitFor } from '@testing-library/react'
import { RiskScoreCard } from '@/components/dashboard/risk-score-card'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('RiskScoreCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<RiskScoreCard />)
    
    expect(screen.getByText('Risk Management Score')).toBeInTheDocument()
    // Check for loading animation classes
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays risk score when data is loaded', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ properties: 3, overdue_inspections: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          reports: [
            { overall_condition: 'satisfactory', risk_rating: 2 },
            { overall_condition: 'satisfactory', risk_rating: 1 }
          ]
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          reports: [
            { drainage_condition: 'good', risk_rating: 1 },
            { drainage_condition: 'fair', risk_rating: 2 }
          ]
        }),
      })
    
    render(<RiskScoreCard />)
    
    await waitFor(() => {
      expect(screen.getByText(/\d+/)).toBeInTheDocument() // Should show a number (score)
      expect(screen.getByText('Active Properties')).toBeInTheDocument()
      expect(screen.getByText('Compliance Rate')).toBeInTheDocument()
    })
  })

  it('shows error state when data fails to load', async () => {
    ;(fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<RiskScoreCard />)
    
    await waitFor(() => {
      expect(screen.getByText('Risk Score Unavailable')).toBeInTheDocument()
      expect(screen.getByText('Unable to calculate risk assessment')).toBeInTheDocument()
    })
  })

  it('displays warnings for overdue inspections', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ properties: 3, overdue_inspections: 2 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ reports: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ reports: [] }),
      })
    
    render(<RiskScoreCard />)
    
    await waitFor(() => {
      expect(screen.getByText('2 overdue inspections')).toBeInTheDocument()
    })
  })

  it('displays warnings for high-risk items', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ properties: 3, overdue_inspections: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          reports: [
            { overall_condition: 'unsatisfactory', risk_rating: 4 }
          ]
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ reports: [] }),
      })
    
    render(<RiskScoreCard />)
    
    await waitFor(() => {
      expect(screen.getByText('1 high-risk item identified')).toBeInTheDocument()
    })
  })
})