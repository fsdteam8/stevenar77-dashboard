"use client";

import React, { useState } from "react";
import { useUser, useDeleteUser, useUpdateUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import { fetchsingleUser } from "@/lib/api";
import { Edit, Eye, Loader, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch users using custom hook
  const { data, isLoading, isError } = useUser(page, limit);

  const users = data?.users || [];
  const pagination = data?.pagination;
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    street: "",
    postalCode: "",
  });

  const filteredUsers = Array.isArray(users)
    ? users.filter((user: User) => user.role === "user")
    : [];

  // View user
  const handleView = async (id: string) => {
    try {
      const user = await fetchsingleUser(id);
      setSelectedUser(user);
    } catch (err) {
      console.error("Failed to fetch single user:", err);
    }
  };

  // Edit user
  const handleEdit = async (id: string) => {
    try {
      const user = await fetchsingleUser(id);
      setUserToEdit(user);
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        location: user.location || "",
        street: user.street || "",
        postalCode: user.postalCode || "",
      });
    } catch (err) {
      console.error("Failed to fetch user for editing:", err);
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userToEdit?._id) {
      updateUser({
        id: userToEdit._id,
        data: editForm,
      });
      setUserToEdit(null);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete?._id) {
      deleteUser(userToDelete._id);
      setUserToDelete(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-2">
        <Loader className="animate-spin text-blue-500 h-8 w-8" />
        <p className="text-gray-600 text-center">Loading users...</p>
      </div>
    );

  if (isError)
    return (
      <p className="text-center py-6 text-red-500">
        Failed to load users. Please try again.
      </p>
    );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              SL No.
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User, index: number) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                {/* SL No. (serial number) */}
                {/* <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td> */}
                <td className="px-6 py-3 text-sm text-gray-700">
                  #{user._id.slice(-4)}
                </td>

                <td className="px-6 py-3 text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {user.email}
                </td>
                {/* <td className="px-6 py-3 text-sm text-gray-700 capitalize">{user.role}</td> */}
                <td className="px-6 py-3 text-sm flex space-x-3">
                  <Button
                    onClick={() => handleView(user._id)}
                    className="bg-transparent hover:bg-gray-300 cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    <Eye />
                  </Button>
                  <Button
                    onClick={() => handleEdit(user._id)}
                    className="bg-transparent hover:bg-gray-300 cursor-pointer text-yellow-500 hover:text-yellow-700"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => setUserToDelete(user)}
                    className="bg-transparent hover:bg-gray-300 cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit User Dialog */}
      <Dialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
        <DialogContent className="max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Edit User
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) =>
                  setEditForm({ ...editForm, dateOfBirth: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={editForm.street}
                onChange={(e) =>
                  setEditForm({ ...editForm, street: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={editForm.postalCode}
                onChange={(e) =>
                  setEditForm({ ...editForm, postalCode: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUserToEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
     
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-gray-700 mt-4">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {userToDelete?.firstName} {userToDelete?.lastName}
            </span>
            ?
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
            <Button onClick={() => setUserToDelete(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md p-6">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-center">
                  User Details
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-3 text-gray-700 flex flex-col items-center">
                {selectedUser.image?.url ? (
                  <Image
                    src={selectedUser.image.url}
                    alt="user image"
                    width={90}
                    height={90}
                    className="rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-700">
                    {`${selectedUser.firstName?.[0] ?? ""}${
                      selectedUser.lastName?.[0] ?? ""
                    }`.toUpperCase()}
                  </div>
                )}

                <div className="mt-4 space-y-2 text-gray-700 text-sm w-full">
                  {/* <p><span className="font-medium">User ID:</span> {selectedUser._id}</p> */}
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedUser.phone || "N/A"}
                  </p>
                  {/* <p><span className="font-medium">Role:</span> {selectedUser.role || "N/A"}</p> */}
                  <p>
                    <span className="font-medium">Verified:</span>{" "}
                    {selectedUser.isVerified ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {selectedUser.dateOfBirth
                      ? new Date(selectedUser.dateOfBirth).toLocaleDateString()
                      : "Not Provided"}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedUser.location || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Street:</span>{" "}
                    {selectedUser.street || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Postal Code:</span>{" "}
                    {selectedUser.postalCode || "N/A"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {pagination && (
        <div className="flex justify-between items-center py-4 px-6">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex space-x-2">
            {/* Previous Button */}
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNumber) => {
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      className={`${
                        pageNumber === page
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              }
            )}

            {/* Next Button */}
            <Button
              disabled={page === pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination.totalPages))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
