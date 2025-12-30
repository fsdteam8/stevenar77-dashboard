"use client";
import React, { useState } from "react";
import { Eye, Loader2, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "../Card/DeleteCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { useDeleteProduct, useProducts } from "@/hooks/useProducts";
import Link from "next/link";

export type Product = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  images?: { url: string }[];
  category: string;
  shortDescription: string;
  longDescription: string;
  inStock: boolean;
  averageRating: number;
  totalReviews: number;
};

const ProductsTable = () => {
  const [page, setPage] = useState(1);
  const limit = 7;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading, isError } = useProducts(page, limit);
  const deleteMutation = useDeleteProduct();

  // console.log(data);

  const products: Product[] = data?.data?.products || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.page || 1;
  const totalItems = meta?.totalItems || 0;

  const handleView = (product: Product) => setSelectedProduct(product);

  const handleDelete = (product: Product) => {
    deleteMutation.mutate(product._id, {
      onSuccess: (res) => {
        toast.success(res.message || `Deleted product: ${product.title}`);
      },
      onError: () => {
        toast.error(`Failed to delete product: ${product.title}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-50 shadow-inner">
          <Loader2 className="animate-spin text-[#06B6D4] w-7 h-7" />
        </div>
        <p className="mt-3 text-[#047481] font-medium text-sm animate-pulse tracking-wide">
          Loading products, please wait...
        </p>
      </div>
    );
  }
  if (isError) {
    return (
      <p className="text-center py-6 text-red-500">Failed to load products.</p>
    );
  }

  // 🔹 Pagination logic (with ellipsis)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxShown = 5;

    if (totalPages <= maxShown) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  // 🔹 Showing results range
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Quantity
              </th> */}
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{product._id.slice(-4)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.length ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            No Img
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#343A40]">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#68706A]">
                    ${product.price}
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-[#68706A]">
                    {product.quantity}
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.category}
                  </td>
                  {/* 🔹 Status */}
                  <td className="px-6 py-4 text-sm">
                    {product.inStock ? (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(product)}
                        className="p-1 text-teal-600 hover:text-teal-700 hover:bg-gray-200 bg-transparent rounded"
                        title="View product"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link href={`/product/edit/${String(product._id)}`}>
                        <Button
                          className="p-1 text-[#68706A] hover:bg-gray-200 bg-transparent rounded"
                          title="Edit product"
                        >
                          <SquarePen className="w-4 h-4" />
                        </Button>
                      </Link>
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
                        itemName={product.title}
                        onConfirm={() => handleDelete(product)}
                        actionText="Delete Product"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination + Results Count */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Showing results */}
        <p className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F]"
          >
            &lt;
          </Button>
          {getPageNumbers().map((num, idx) =>
            typeof num === "number" ? (
              <Button
                key={idx}
                onClick={() => setPage(num)}
                className={`${
                  currentPage === num
                    ? "bg-[#0694A2] hover:bg-[#0694A2] text-white"
                    : "bg-gray-100 text-gray-700 border border-[#0694A2]"
                } hover:bg-[#0694A2]`}
              >
                {num}
              </Button>
            ) : (
              <span key={idx} className="px-2 text-gray-500">
                {num}
              </span>
            )
          )}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-[#8E938F]"
          >
            &gt;
          </Button>
        </div>
      </div>

      {/* 🔹 Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
          {selectedProduct && (
            <div className="flex flex-col h-[80vh]">
              {" "}
              {/* Top Image */}
              <div className="w-full h-64 relative flex-shrink-0">
                {selectedProduct.images?.length ? (
                  <Image
                    src={selectedProduct.images[0].url}
                    alt={selectedProduct.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {" "}
                {/* ✅ Scrollable content */}
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedProduct.title}
                  </DialogTitle>
                </DialogHeader>
                {/* Reviews */}
                <p className="mt-4 text-gray-600 text-sm">
                  ⭐ {selectedProduct.averageRating} (
                  {selectedProduct.totalReviews} reviews)
                </p>
                {/* Price */}
                <p className="mt-4 text-lg font-medium text-teal-600">
                  ${selectedProduct.price}
                </p>
                {/* Quantity + Stock */}
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span>Quantity: {selectedProduct.quantity}</span>
                  <span>
                    {selectedProduct.inStock ? (
                      <span className="text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </span>
                </div>
                {/* Short Description */}
                <p
                  className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line italic"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.shortDescription,
                  }}
                />
                {/* Long Description */}
                <p
                  className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line italic"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.longDescription,
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
