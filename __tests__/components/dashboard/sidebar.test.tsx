import { render, screen } from '@testing-library/react'
import { DashboardSidebar } from '@/app/components/dashboard/sidebar'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

describe('DashboardSidebar', () => {
  it('renders all navigation links', () => {
    render(<DashboardSidebar isOpen={true} />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Risk Score')).toBeInTheDocument()
    expect(screen.getByText('Drainage')).toBeInTheDocument()
    expect(screen.getByText('Electrical')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Insurance')).toBeInTheDocument()
  })

  it('shows Hoops Store branding', () => {
    render(<DashboardSidebar isOpen={true} />)
    
    expect(screen.getByText('Hoops Store')).toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    render(<DashboardSidebar isOpen={true} />)
    
    const dashboardLink = screen.getByRole('link', { name: /📊 Dashboard/ })
    expect(dashboardLink).toHaveClass('bg-blue-50', 'text-blue-600')
  })

  it('shows coming soon items as disabled', () => {
    render(<DashboardSidebar isOpen={true} />)
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('Staff')).toBeInTheDocument()
    expect(screen.getByText('Facility')).toBeInTheDocument()
    expect(screen.getByText('Building')).toBeInTheDocument()
    
    // Check that coming soon items are disabled
    const staffItem = screen.getByText('Staff').closest('div')
    expect(staffItem).toHaveClass('cursor-not-allowed', 'opacity-60')
  })

  it('applies mobile transform classes based on isOpen prop', () => {
    const { rerender } = render(<DashboardSidebar isOpen={false} />)
    
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('-translate-x-full')
    
    rerender(<DashboardSidebar isOpen={true} />)
    expect(sidebar).toHaveClass('translate-x-0')
  })

  it('has correct responsive classes for desktop', () => {
    render(<DashboardSidebar isOpen={false} />)
    
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('lg:translate-x-0')
  })

  it('has proper z-index for mobile overlay', () => {
    render(<DashboardSidebar isOpen={true} />)
    
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('z-50')
  })
})