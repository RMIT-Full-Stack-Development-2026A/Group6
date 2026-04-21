import React from "react";

interface User {
  id: string;
  username: string;
  email: string;
  premiumStatus: "PREMIUM" | "STANDAR";
  accountStatus: "Active" | "Deactivated";
}

interface UserTableProps {
  users?: User[];
  onDeactivate?: (userId: string) => void;
  onReactivate?: (userId: string) => void;
}

// Default sample data
const defaultUsers: User[] = [
  {
    id: "1",
    username: "Sample User",
    email: "user@example.com",
    premiumStatus: "PREMIUM",
    accountStatus: "Active",
  },
  {
    id: "2",
    username: "John Doe",
    email: "john.doe@example.com",
    premiumStatus: "STANDAR",
    accountStatus: "Deactivated",
  },
];

export default function UserTable({ users = defaultUsers, onDeactivate, onReactivate }: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Username</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Premium Status</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Account Status</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      user.premiumStatus === "PREMIUM"
                        ? "bg-green-300 text-green-900"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {user.premiumStatus}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${
                  user.accountStatus === "Active" ? "text-green-700" : "text-red-600"
                }`}>
                  {user.accountStatus}
                </td>
                <td className="px-6 py-4">
                  {user.accountStatus === "Active" ? (
                    <button
                      onClick={() => onDeactivate?.(user.id)}
                      className="text-gray-800 hover:text-red-600 font-bold"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => onReactivate?.(user.id)}
                      className="text-gray-800 hover:text-green-600 font-bold"
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
