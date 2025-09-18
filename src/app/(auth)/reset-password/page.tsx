import ResetPassword from '@/components/Auth/ResetPassword/ResetPassword'
import React, { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </div>
  )
}
