import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AuthIdButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const AuthIdButton = forwardRef<HTMLButtonElement, AuthIdButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        type="button"
        className={cn(
          'flex h-[86px] w-full items-center justify-center border border-black bg-white transition-colors hover:bg-gray-50',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black text-xl text-white font-cygre">
          id
        </div>
      </button>
    )
  }
)
AuthIdButton.displayName = 'AuthIdButton'

export { AuthIdButton }
