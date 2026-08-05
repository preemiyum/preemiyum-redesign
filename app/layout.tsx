'use client'
import { useEffect } from 'react'
import { initializeReferralTracking } from '@/lib/referral-tracker'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeReferralTracking()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
