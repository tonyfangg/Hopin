import { ReactNode, HTMLAttributes } from 'react'
import { cn } from './utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = ({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  ...props
}: CardProps) => {
  const baseClasses = 'rounded-xl transition-all duration-200'
  
  const variants = {
    default: 'bg-white border border-slate-200 hover:shadow-sm',
    elevated: 'bg-white shadow-sm border border-slate-200 hover:shadow-md',
    outlined: 'bg-transparent border-2 border-slate-200 hover:border-slate-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div
      className={cn(baseClasses, variants[variant], paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
