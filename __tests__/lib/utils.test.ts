import { cn, formatDate, formatCurrency } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('handles conditional classes', () => {
      expect(cn('px-4', true && 'py-2')).toBe('px-4 py-2')
      expect(cn('px-4', false && 'py-2')).toBe('px-4')
    })

    it('merges conflicting Tailwind classes', () => {
      expect(cn('px-4', 'px-6')).toBe('px-6')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('handles arrays and objects', () => {
      expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2')
      expect(cn({ 'px-4': true, 'py-2': false })).toBe('px-4')
    })
  })

  describe('formatDate', () => {
    it('formats Date object correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('January 15, 2024')
    })

    it('formats date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024')
    })

    it('handles different date formats', () => {
      expect(formatDate('2024-12-25')).toBe('December 25, 2024')
      expect(formatDate('2024-06-01')).toBe('June 1, 2024')
    })
  })

  describe('formatCurrency', () => {
    it('formats British pounds correctly', () => {
      expect(formatCurrency(1000)).toBe('£1,000.00')
      expect(formatCurrency(1000.5)).toBe('£1,000.50')
      expect(formatCurrency(0)).toBe('£0.00')
    })

    it('handles negative amounts', () => {
      expect(formatCurrency(-500)).toBe('-£500.00')
    })

    it('handles large amounts', () => {
      expect(formatCurrency(1000000)).toBe('£1,000,000.00')
    })

    it('handles decimal places correctly', () => {
      expect(formatCurrency(99.99)).toBe('£99.99')
      expect(formatCurrency(100.1)).toBe('£100.10')
    })
  })
})