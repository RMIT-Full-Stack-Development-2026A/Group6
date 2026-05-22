import React from "react";
import UserManagementHeader from "./UserManagementHeader";
import UserTable from "./UserTable";
import { User } from "@/services/adminUserManagement.service";

interface UserManagementProps {
  users: User[];
  onRegister?: () => void;
  onDeactivate?: (userId: string) => void;
  onReactivate?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function UserManagement({
  users,
  onRegister,
  onDeactivate,
  onReactivate,
  onDelete,
  searchQuery,
  onSearchChange, 
}: UserManagementProps) {
  return (
    <div>
      <UserManagementHeader onRegister={onRegister} searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <UserTable users={users} onDeactivate={onDeactivate} onReactivate={onReactivate} onDelete={onDelete} />
    </div>
  );
}
