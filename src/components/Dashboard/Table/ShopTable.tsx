import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteAlertDialog from '../Card/DeleteCard';

type Product = {
  id: string;
  invoice: string;
  productName: string;
  price: string;  // Keeping string because your price has '$' sign
  quantity: string;
  status: 'In Stock' | 'Out of Stock' | 'Low';
  date: string;
};

const ShopTable = () => {
  // Updated to match Product type and added id field
  const tableData: Product[] = [
    {
      id: '1',
      invoice: '#3066',
      productName: 'AquaLung Revelation 3X Mask',
      price: '$250',
      quantity: '3 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '2',
      invoice: '#3067',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '2 Item',
      status: 'In Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '3',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '4',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '5',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '6',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '7',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '8',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '9',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },
    {
      id: '10',
      invoice: '#3068',
      productName: 'St Croix, Virgin Island',
      price: '$250',
      quantity: '3 Item',
      status: 'Out of Stock',
      date: 'Jan 06, 2025',
    },

     
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

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product.id);
    // Add your delete logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Invoice</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Product Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-600 font-medium">{item.invoice}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-md flex items-center justify-center">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{item.productName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.price}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.quantity}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button className="p-1.5 rounded-md hover:bg-gray-200 bg-transparent text-blue-600">
                      <Eye size={16} />
                    </Button>
                    <DeleteAlertDialog
                      trigger={
                        <Button
                          className="p-1 text-red-600 bg-transparent rounded hover:bg-gray-200 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      }
                      title="Delete Product"
                      itemName={item.productName}
                      onConfirm={() => handleDelete(item)}
                      actionText="Delete Product"
                    />
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
