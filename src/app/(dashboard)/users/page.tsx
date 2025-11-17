import UsersTable from '@/components/Dashboard/Users/UsersTable'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className="py-4">
        <h2 className="text-2xl font-bold ">
          Divers Management 
        </h2>
      </div>
        <UsersTable />
    </div>
  )
}
