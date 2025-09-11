"use client"
import React, { useState } from "react"
import { ArrowUpDown, Eye } from "lucide-react"

export type Payment = {
  id: string
  invoice: string
  courseName: string
  courseDuration: string
  price: number
  paymentStatus: "Paid" | "Pending"
  paymentMethod: "PayPal" | "Credit Card"
  date: string
}

const data: Payment[] = [
  {
    id: "1",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "2",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "3",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
  {
    id: "4",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Pending",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "5",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "6",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "7",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
  {
    id: "8",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    date: "Jan 06, 2025",
  },
  {
    id: "9",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
  {
    id: "10",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
  {
    id: "11",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
  {
    id: "12",
    invoice: "#3066",
    courseName: "Open Water Dive",
    courseDuration: "4 days",
    price: 250,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    date: "Jan 06, 2025",
  },
]

const PaymentTable = () => {
  const [sortField, setSortField] = useState<keyof Payment | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleViewDetails = (payment: Payment) => {
    console.log("View payment details:", payment.id)
  }

  const getPaymentStatusBadgeStyle = (status: Payment["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return "bg-teal-100 text-teal-800 border border-teal-200"
      case "Pending":
        return "bg-purple-100 text-purple-800 border border-purple-200"
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
  }, [data, sortField, sortDirection])

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
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Method
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
            {paginatedData.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.invoice}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.courseName}</div>
                      <div className="text-xs text-gray-500">{payment.courseDuration}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${payment.price}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeStyle(payment.paymentStatus)}`}>
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.date}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(payment)}
                    className="p-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                    title="View payment details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No payments found.
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

export default PaymentTable