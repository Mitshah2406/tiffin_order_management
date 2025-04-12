import AppConstants from "@/utils/constants";

export const NODE_CONFIG = {
  BASE_URL: AppConstants.IP,
  headers: {
    "Content-Type": "application/json",
  },
};

// Customer functions
export const createCustomer = async (name: string, mobileNumber: string) => {
  try {
    // Convert the mobile number to a number
    const mobileNo = parseInt(mobileNumber);

    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customer`, {
      method: "POST",
      body: JSON.stringify({ name, mobileNumber: mobileNo }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to sign in: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customer`, {
      method: "GET",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



// Product Functions
export const createProduct = async (name: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/product`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: NODE_CONFIG.headers,
    });


    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Product already exists");
      } else {
        throw new Error(`Failed to add product: ${response.status}`);
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editProduct = async (id: string, name: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/product/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Product does not exist");
      } else {
        throw new Error(`Failed to update product: ${response.status}`);
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteProduct = async (id: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/product/${id}`, {
      method: "DELETE",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/product`, {
      method: "GET",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// Customization Functions
export const createCustomization = async (description: string, price: number, productId: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customizations`, {
      method: "POST",
      body: JSON.stringify({ description, price, productId }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to add customization: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAllCustomizations = async () => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customizations`, {
      method: "GET",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customizations: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateCustomization = async (id: string, description: string, price: number, productId: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customizations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ description, price, productId }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to update customization: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteCustomization = async (id: string) => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/customizations/${id}`, {
      method: "DELETE",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete customization: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}