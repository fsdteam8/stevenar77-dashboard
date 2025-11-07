"use client";
import React, { useState } from "react";
import { AlertCircle, Eye, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAllOrders, useOrders } from "@/hooks/useOrder";
import Image from "next/image";
import { toast } from "sonner";

export type Order = {
  _id: string;
  status: string;
  totalPrice: number;
  quantity: number;
  color?: string;
  createdAt: string;
  images?: { public_id: string; url: string }[];
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    image?: { url: string };
  };
  productId?: { title: string; images?: { url: string }[] } | null;
};

const OrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 10;

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useOrders(currentPage, itemsPerPage);

  const orders: Order[] = ordersResponse?.data || [];
  const totalItems = ordersResponse?.meta?.total || 0;
  const totalPages = ordersResponse?.meta?.totalPage || 1;

  const handleView = (order: Order) => setSelectedOrder(order);

  const handleDeleteSingle = (id: string) => {
    deleteOrders([id], {
      onSuccess: () => {
        toast.success("Order deleted successfully!");
        // Remove the deleted ID from selectedIds if it exists
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      },
      onError: (error) => {
        toast.error("Failed to delete order");
        console.error(error);
      },
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(orders.map((o) => o._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const { mutate: deleteOrders } = useDeleteAllOrders();

  const handleOrderDeleteSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("No orders selected to delete");
      return;
    }

    deleteOrders(selectedIds, {
      onSuccess: () => {
        toast.success("Selected orders deleted successfully!");
        setSelectedIds([]);
      },
      onError: (error) => {
        toast.error("Failed to delete orders");
        console.error(error);
      },
    });
  };

  const isAllSelected =
    orders.length > 0 && selectedIds.length === orders.length;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Loading Orders...
        </p>
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <p className="mt-4 text-red-600 text-lg font-medium">
          Failed to load product
        </p>
        <p className="text-gray-500 text-sm mt-1">Please try again later.</p>
      </div>
    );

  return (
    <div className="w-full bg-white p-6">
      {/* Title + Delete Selected Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
        {selectedIds.length > 0 && (
          <Button
            onClick={handleOrderDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Orders ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 accent-[#0694A2] cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Placed At
              </th>

              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order._id)}
                      onChange={() => handleSelectOne(order._id)}
                      className="h-4 w-4 accent-[#0694A2] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{order._id.slice(-4)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2 text-sm text-gray-600">
                    {order.userId.image?.url && (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={order.userId.image.url}
                          alt={order.userId.firstName}
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                    {order.userId.firstName} {order.userId.lastName}
                    <div></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.productId?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${order.totalPrice}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      onClick={() => handleView(order)}
                      className="p-1 text-teal-600 hover:text-teal-700 hover:bg-gray-200 bg-transparent rounded"
                      title="View order"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteSingle(order._id)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-gray-200 bg-transparent rounded"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>

          {(() => {
            const visiblePages: (number | string)[] = [];
            if (totalPages <= 6) {
              for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
            } else {
              visiblePages.push(1);
              if (currentPage > 3) visiblePages.push("...");
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              for (let i = start; i <= end; i++) visiblePages.push(i);
              if (currentPage < totalPages - 2) visiblePages.push("...");
              visiblePages.push(totalPages);
            }

            return visiblePages.map((num, idx) =>
              num === "..." ? (
                <span key={idx} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num as number)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === num
                      ? "bg-[#0694A2] text-white border-[#0694A2]"
                      : "bg-gray-100 text-gray-700 border border-[#0694A2] hover:bg-gray-200"
                  } cursor-pointer`}
                >
                  {num}
                </button>
              )
            );
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl p-6 rounded-2xl">
          {selectedOrder && (
            <div
              className="flex flex-col gap-8"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">
                  Order Details
                </DialogTitle>
              </DialogHeader>

              {/* Customer Info */}
              <section className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Customer Info
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {selectedOrder.userId.image?.url ? (
                      <Image
                        src={selectedOrder.userId.image.url}
                        alt={selectedOrder.userId.firstName}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Image</span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {selectedOrder.userId.firstName}{" "}
                      {selectedOrder.userId.lastName}
                    </p>
                    <p className="text-gray-500">
                      {selectedOrder.userId.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      Order ID: #{selectedOrder._id.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Placed at:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              {/* Product Info */}
              <section className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Product Info
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
                    {selectedOrder.productId?.images?.[0]?.url ? (
                      <Image
                        src={selectedOrder.productId.images[0].url}
                        alt={selectedOrder.productId.title}
                        width={80}
                        height={80}
                      />
                    ) : (
                      <span className="text-gray-500 text-xs text-center">
                        No Image
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {selectedOrder.productId?.title || "N/A"}
                    </p>
                    <p className="text-gray-500">
                      Color: {selectedOrder.color || "N/A"}
                    </p>
                    <p className="text-gray-500">
                      Quantity: {selectedOrder.quantity}
                    </p>
                    <p className="text-gray-500">
                      Total Price: ${selectedOrder.totalPrice}
                    </p>
                  </div>
                </div>
              </section>

              {/* Additional Images */}
              <section className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Additional Images
                </h3>
                {selectedOrder?.images?.length ? (
                  <div className="flex flex-col gap-4">
                    {selectedOrder?.images?.map((img) => (
                      <div
                        key={img.public_id}
                        className="w-full rounded overflow-hidden bg-gray-200 flex items-center justify-center"
                      >
                        <Image
                          src={img.url}
                          alt="Order image"
                          width={800}
                          height={600}
                          className="object-contain w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No additional images provided.
                  </p>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
