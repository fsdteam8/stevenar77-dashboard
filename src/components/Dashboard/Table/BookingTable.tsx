"use client"
import React, { useState } from "react"
import { ArrowUpDown, Eye } from "lucide-react"
import Image from "next/image"

export type Booking = {
  id: string
  invoice: string
  customerName: string
  customerEmail: string
  location: string
  price: number
  status: "Paid" | "Cancelled"
  date: string
  avatar: string
}

const data: Booking[] = [
  {
    id: "1",
    invoice: "#3066",
    customerName: "James Geidt",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "2",
    invoice: "#3066",
    customerName: "Alfredo Korsgaard",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "3",
    invoice: "#3066",
    customerName: "Zaire Saris",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "4",
    invoice: "#3066",
    customerName: "Leo Korsgaard",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Cancelled",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "5",
    invoice: "#3066",
    customerName: "Maren Franci",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "6",
    invoice: "#3066",
    customerName: "Martin Franci",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "7",
    invoice: "#3066",
    customerName: "Phillip Press",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Cancelled",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "8",
    invoice: "#3066",
    customerName: "Cristofer Dorwart",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "9",
    invoice: "#3066",
    customerName: "James Press",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "10",
    invoice: "#3066",
    customerName: "Justin Mango",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "11",
    invoice: "#3066",
    customerName: "Justin Mango",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
  {
    id: "12",
    invoice: "#3066",
    customerName: "Justin Mango",
    customerEmail: "olivia@untitledui.com",
    location: "2715 Ash Dr. San Jose, South Dakota 83475",
    price: 2000,
    status: "Paid",
    date: "Jan 06, 2025",
    avatar: "/images/profile-mini.jpg"
  },
]

const BookingTable = () => {
  const [sortField, setSortField] = useState<keyof Booking | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleViewDetails = (booking: Booking) => {
    console.log("View details for:", booking.customerName)
  }

  const getStatusBadgeStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-teal-100 text-teal-800 border border-teal-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortField) return data
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [sortField, sortDirection])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('invoice')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Invoice
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.invoice}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.avatar}
                      alt={booking.customerName}
                      width={30}
                      height={30}
                      className=" rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${booking.avatar}`;
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  {booking.location}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${booking.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.date}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingTable