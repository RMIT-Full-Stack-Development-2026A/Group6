const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface User {
  id: string;
  username: string;
  email: string;
  premiumStatus: "PREMIUM" | "STANDARD";
  accountStatus: "Active" | "Deactivated";
}

export interface AdminCreateUserPayload {
  username: string;
  email: string;
  password: string;
  country: string;
  role?: 'player' | 'admin';
  currentSubscription?: string | null; 
}

function getAuthHeaders() {
  if (typeof window === "undefined") return {
    "Content-Type": "application/json",
  };

  const token = sessionStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found. Please login again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Fetch all users
 * API Endpoint: GET /api/users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users?limit=100`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`); 
    }

    const result = await response.json();
    const users = result?.data || [];

    return users.map((user: any) => ({
      id: user._id || user.id,
      username: user.username,
      email: user.email,
      premiumStatus: user.currentSubscription ? "PREMIUM" : "STANDARD",
      accountStatus:
        user.isActive === true || user.status === "active"
          ? "Active"
          : "Deactivated",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

/**
 * Register a new user
 * API Endpoint: POST /api/users/register
 */
export async function registerUser(userData: AdminCreateUserPayload): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.statusText}`); 
    }

    const result = await response.json();
    const createdUser = result?.data;

    return {
      id: createdUser._id || createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      premiumStatus: createdUser.currentSubscription ? "PREMIUM" : "STANDARD",
      accountStatus:
        createdUser.isActive === true || createdUser.status === "active"
          ? "Active"
          : "Deactivated",
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

/**
 * Deactivate a user account
 * API Endpoint: PUT /api/users/:id/deactivate
 */
export async function deactivateUser(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/deactivate`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to deactivate user: ${response.statusText}`); 
    }

    return await response.json();
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
}

/**
 * Reactivate a user account
 * API Endpoint: PUT /api/users/:id/reactivate
 */
export async function reactivateUser(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/reactivate`, { 
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to reactivate user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error reactivating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  if (!userId) {
    throw new Error("Invalid user ID. Cannot delete user.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `Failed to delete user: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
