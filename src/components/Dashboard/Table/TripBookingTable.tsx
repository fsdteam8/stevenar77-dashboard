// "use client";
// import React, { useState, useMemo } from "react";
// import { Trash2, MoreHorizontal } from "lucide-react";

// // shadcn/ui components
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";

// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

// const initialData: Payment[] = [
//   { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
//   { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@example.com" },
//   { id: "derv1ws0", amount: 837, status: "processing", email: "mon@example.com" },
//   { id: "5kma53ae", amount: 874, status: "success", email: "silas@example.com" },
//   { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
//   { id: "xk3nd7f2", amount: 450, status: "pending", email: "john@example.com" },
//   { id: "9pl2mx8w", amount: 623, status: "success", email: "sarah@example.com" },
// ];

// const ITEMS_PER_PAGE = 5;

// const TripBookingTable = () => {
//   const [items, setItems] = useState<Payment[]>(initialData);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [page, setPage] = useState(1);

//   const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

//   const paginatedItems = useMemo(() => {
//     const start = (page - 1) * ITEMS_PER_PAGE;
//     return items.slice(start, start + ITEMS_PER_PAGE);
//   }, [page, items]);

//   const isAllSelected =
//     paginatedItems.length > 0 &&
//     paginatedItems.every((item) => selected.includes(item.id));

//   const toggleSelect = (id: string) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       const visibleIds = paginatedItems.map((i) => i.id);
//       setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
//     } else {
//       const visibleIds = paginatedItems.map((i) => i.id);
//       setSelected((prev) => [...new Set([...prev, ...visibleIds])]);
//     }
//   };

//   const handleDelete = () => {
//     setItems((prev) => prev.filter((item) => !selected.includes(item.id)));
//     setSelected([]);

//     // Adjust page if current page becomes empty
//     const newTotalPages = Math.ceil(
//       items.filter((item) => !selected.includes(item.id)).length / ITEMS_PER_PAGE
//     );
//     if (page > newTotalPages && newTotalPages > 0) {
//       setPage(newTotalPages);
//     }
//   };

//   return (
//     <div className="w-full p-6">
//       <h2 className="text-2xl font-bold mb-4">Trip Booking Table</h2>

//       {/* Bulk Actions */}
//       <div className="flex items-center justify-between py-3">
//         <p className="text-sm text-gray-600">
//           {selected.length} selected
//         </p>

//         {selected.length > 0 && (
//           <Button
//             onClick={handleDelete}
//             className="bg-red-600 hover:bg-red-700 text-white"
//           >
//             <Trash2 className="mr-2 h-4 w-4" />
//             Delete Selected ({selected.length})
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border border-gray-200">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-4 py-3 text-left">
//                 <div
//                   className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSelectAll();
//                   }}
//                 >
//                   <Checkbox
//                     checked={isAllSelected}
//                     className="pointer-events-none"
//                   />
//                 </div>
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
//               <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedItems.length > 0 ? (
//               paginatedItems.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3">
//                     <div
//                       className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleSelect(item.id);
//                       }}
//                     >
//                       <Checkbox
//                         checked={selected.includes(item.id)}
//                         className="pointer-events-none"
//                       />
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="capitalize text-sm">{item.status}</div>
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.email}</td>
//                   <td className="px-4 py-3 text-right text-sm font-medium">${item.amount}</td>
//                   <td className="px-4 py-3">
//                     <Button variant="ghost" size="sm">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                   No results.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//         >
//           Prev
//         </button>

//         <span className="text-sm text-gray-600">
//           Page {page} of {totalPages || 1}
//         </span>

//         <button
//           disabled={page === totalPages || totalPages === 0}
//           onClick={() => setPage(page + 1)}
//           className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TripBookingTable;

"use client";
import React, { useState, useMemo } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAllAdminTrips } from "@/hooks/useAlladminTrips";

const ITEMS_PER_PAGE = 5;

const TripBookingTable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAllAdminTrips(page, ITEMS_PER_PAGE);

  const items = data?.data || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  console.log(items);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [page, items]);

  const isAllSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item: { _id: string }) =>
      selected.includes(item._id)
    );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visibleIds = paginatedItems.map((i: { _id: any }) => i._id);
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visibleIds = paginatedItems.map((i: { _id: any }) => i._id);
      setSelected((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleDelete = () => {
    // Optional: Implement delete API call
    setSelected([]);
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading trips...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">Error loading trips!</p>
    );
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Trip Booking Table</h2>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-gray-600">{selected.length} selected</p>
        {selected.length > 0 && (
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selected.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">
                <div
                  className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectAll();
                  }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    className="pointer-events-none"
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Mobile
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.length > 0 ? (
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              paginatedItems.map(
                (item: {
                  //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  participants: any[];
                  _id: React.Key | null | string ;
                  status:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        string | React.JSXElementConstructor<any>
                      >
                    
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            //eslint-disable-next-line @typescript-eslint/no-explicit-any
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                      mobile:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                            //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | null
                    | undefined;
                  totalPrice:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                            //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            //eslint-disable-next-line @typescript-eslint/no-explicit-any
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => {
                  const participant = item.participants[0]; // first participant
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div
                          className="inline-flex items-center justify-center p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof item._id === "string") {
                              toggleSelect(item._id);
                            }
                          }}
                        >
                          <Checkbox
                            checked={typeof item._id === "string" && selected.includes(item._id)}
                            className="pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{`${participant.firstName} ${participant.lastName}`}</td>
                      <td className="px-4 py-3 text-sm">{participant.email}</td>
                      <td className="px-4 py-3 text-sm capitalize">
                        {/* {item.status} */}
                        {participant.mobile}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        ${item.totalPrice}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripBookingTable;
