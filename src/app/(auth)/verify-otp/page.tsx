import VerifyOTP from '@/components/Auth/VerifyOTP/VerifyOTP'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>

        <VerifyOTP />
      </Suspense>
    </div>
  )
}
