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

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
    };
  }

  const token = sessionStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!token) {
    throw new Error("No auth token found. Please login again.");
  }

  headers.Authorization = `Bearer ${token}`;
  return headers;
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
      premiumStatus: user.subscription ? "PREMIUM" : "STANDARD",
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to register user: ${response.statusText}`); 
    }

    const result = await response.json();
    const createdUser = result?.data;

    if (!createdUser) {
      throw new Error("No user data returned from server");
    }

    return {
      id: createdUser._id || createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      premiumStatus: createdUser.subscription ? "PREMIUM" : "STANDARD",
      accountStatus:
        createdUser.isActive === true || createdUser.status === "active"
          ? "Active"
          : "Deactivated",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to register user";
    console.error("Error registering user:", error);
    throw new Error(message);
  }
}

export async function deactivateUser(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/deactivate`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to deactivate user: ${response.statusText}`);
    }

    const result = await response.json();
    return result?.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to deactivate user";
    console.error("Error deactivating user:", error);
    throw new Error(message);
  }
}

export async function reactivateUser(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/reactivate`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to reactivate user: ${response.statusText}`);
    }

    const result = await response.json();
    return result?.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reactivate user";
    console.error("Error reactivating user:", error);
    throw new Error(message);
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
