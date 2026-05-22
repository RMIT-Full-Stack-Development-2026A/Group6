const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface User {
  id: string;
  username: string;
  email: string;
  premiumStatus: "PREMIUM" | "STANDAR";
  accountStatus: "Active" | "Deactivated";
}

/**
 * Fetch all users
 * API Endpoint: GET /api/users
 */
export async function getUsers(): Promise<User[]> {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/users`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch users: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error fetching users:", error);
  //   return [];
  // }
  return [];
}

/**
 * Register a new user
 * API Endpoint: POST /api/users/register
 */
export async function registerUser(userData: Omit<User, "id">) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/users/register`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(userData),
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to register user: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error registering user:", error);
  //   throw error;
  // }
  console.log("Registering user:", userData);
}

/**
 * Deactivate a user account
 * API Endpoint: PUT /api/users/:id/deactivate
 */
export async function deactivateUser(userId: string) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/users/${userId}/deactivate`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to deactivate user: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error deactivating user:", error);
  //   throw error;
  // }
  console.log("Deactivating user:", userId);
}

/**
 * Reactivate a user account
 * API Endpoint: PUT /api/users/:id/reactivate
 */
export async function reactivateUser(userId: string) {
  // TODO: Uncomment API call when backend is ready
  // try {
  //   const response = await fetch(`${API_BASE_URL}/users/${userId}/reactivate`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //
  //   if (!response.ok) {
  //     throw new Error(`Failed to reactivate user: ${response.statusText}`);
  //   }
  //
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error reactivating user:", error);
  //   throw error;
  // }
  console.log("Reactivating user:", userId);
}
