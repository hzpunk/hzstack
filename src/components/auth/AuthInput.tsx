import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  showPasswordToggle?: boolean
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, error, type, showPasswordToggle, autoComplete, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full relative">
        <input
          className={cn(
            'w-full h-[50px] border border-black/20 py-2 text-[30px] leading-tight outline-none transition-colors',
            'pl-[26px]',
            showPasswordToggle && type === 'password' ? 'pr-[50px]' : '',
            'placeholder:text-[20px] placeholder:text-black/30',
            'focus:border-black disabled:cursor-not-allowed disabled:opacity-50 font-cygre',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          type={inputType}
          ref={ref}
          autoComplete={autoComplete || 'off'}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
AuthInput.displayName = 'AuthInput'

export { AuthInput }
