import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const ShopTable = () => {
  const tableData = [
    {
      invoice: '#3066',
      productName: 'AquaLung Revelation 3X Mask',
      price: '$250',
      quantity: '3 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '2 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '1 Item',
      status: 'Low',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '7 Item',
      status: 'Low',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '9 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025'
    },
    {
      invoice: '#3066',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600 bg-green-50';
      case 'Out of Stock':
        return 'text-red-600 bg-red-50';
      case 'Low':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Invoice
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Product Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Price
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Quantity
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-600 font-medium">
                  {item.invoice}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-md flex items-center justify-center">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {item.productName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {item.price}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {item.quantity}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {item.date}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-full hover:bg-blue-50 text-blue-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-red-50 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopTable;