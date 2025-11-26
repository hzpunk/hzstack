import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          'w-full rounded-none bg-black py-4 text-center text-[16px] text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 font-cygre',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
AuthButton.displayName = 'AuthButton'

export { AuthButton }
