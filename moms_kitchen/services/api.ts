import AppConstants from "@/utils/constants";

export const NODE_CONFIG = {
  BASE_URL: AppConstants.IP,
  headers: {
    "Content-Type": "application/json",
  },
};

export const signIn = async (username: string, password: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/signIn`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to sign in: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
