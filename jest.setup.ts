import '@testing-library/jest-dom'

jest.mock('next/link', () => {
  const React = require('react')

  return {
    __esModule: true,
    default: ({ href, children, ...props }: any) => {
      const resolvedHref = typeof href === 'string' ? href : href?.pathname || ''
      return React.createElement('a', { href: resolvedHref, ...props }, children)
    },
  }
})
