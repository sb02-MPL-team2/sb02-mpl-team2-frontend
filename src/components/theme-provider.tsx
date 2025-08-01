'use client'

import * as React from 'react'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  ...props 
}: ThemeProviderProps) {
  return <div {...props}>{children}</div>
}
