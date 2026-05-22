import React from "react";
import UserManagementHeader from "./UserManagementHeader";
import UserTable from "./UserTable";
import { User } from "@/services/adminUserManagement.service";

interface UserManagementProps {
  users: User[];
  onRegister?: () => void;
  onDeactivate?: (userId: string) => void;
  onReactivate?: (userId: string) => void;
}

export default function UserManagement({
  users,
  onRegister,
  onDeactivate,
  onReactivate,
}: UserManagementProps) {
  return (
    <div>
      <UserManagementHeader onRegister={onRegister} />
      <UserTable users={users} onDeactivate={onDeactivate} onReactivate={onReactivate} />
    </div>
  );
}
