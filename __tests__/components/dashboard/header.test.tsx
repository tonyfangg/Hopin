import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeader } from '@/app/components/dashboard/header'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock the Supabase hook
jest.mock('@/lib/hooks/useSupabase', () => ({
  useSupabase: () => ({
    auth: {
      signOut: jest.fn(() => Promise.resolve()),
    },
  }),
}))

describe('DashboardHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders header with dashboard title', () => {
    render(<DashboardHeader />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('displays user email when provided', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: '',
      created_at: '',
    }
    
    render(<DashboardHeader user={mockUser} />)
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('shows Guest when no user provided', () => {
    render(<DashboardHeader />)
    
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('calls onMenuClick when hamburger menu is clicked', () => {
    const mockOnMenuClick = jest.fn()
    
    render(<DashboardHeader onMenuClick={mockOnMenuClick} />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1)
  })

  it('signs out user and redirects when sign out is clicked', async () => {
    render(<DashboardHeader />)
    
    const signOutButton = screen.getByText('Sign out')
    fireEvent.click(signOutButton)
    
    // Note: signOut is mocked globally, we just check the navigation
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('has responsive design classes', () => {
    render(<DashboardHeader />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('h-16', 'border-b', 'border-slate-200', 'bg-white')
    
    const container = header.firstChild
    expect(container).toHaveClass('px-4', 'sm:px-6')
  })
})