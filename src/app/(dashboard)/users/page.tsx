import UsersTable from '@/components/Dashboard/Users/UsersTable'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className="mb-4 py-6">
        <h2 className="text-2xl ">
          User Management 
        </h2>
      </div>
        <UsersTable />
    </div>
  )
}
