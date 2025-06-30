import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from './utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search' | 'error'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className,
  variant = 'default',
  size = 'md',
  icon,
  ...props
}, ref) => {
  const baseClasses = 'w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  
  const variants = {
    default: 'border-slate-300 bg-white hover:border-slate-400',
    search: 'border-slate-300 bg-slate-50 hover:bg-white focus:bg-white',
    error: 'border-red-300 bg-red-50 hover:border-red-400 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-4 text-lg'
  }
  
  const inputClasses = cn(baseClasses, variants[variant], sizes[size], className)
  
  if (icon) {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          ref={ref}
          className={cn(inputClasses, 'pl-10')}
          {...props}
        />
      </div>
    )
  }
  
  return (
    <input
      ref={ref}
      className={inputClasses}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
