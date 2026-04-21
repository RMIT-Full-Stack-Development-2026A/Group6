import React from "react";
import UserManagementHeader from "./UserManagementHeader";
import UserTable from "./UserTable";

interface User {
  id: string;
  username: string;
  email: string;
  premiumStatus: "PREMIUM" | "STANDAR";
  accountStatus: "Active" | "Deactivated";
}

interface UserManagementProps {
  users?: User[];
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
