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

// export const getAllProductsWithCustomizations = async () => {
//   try {
//     const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/product/customization`, {
//       method: "GET",
//       headers: NODE_CONFIG.headers,
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch products with customizations: ${response.status}`);
//     }

//     const data = await response.json();

//     return data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }


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


// Order Functions
export const createOrder = async (
  customerId: string,
  orderTime: string,
  items: Array<{
    productId: string;
    quantity: number;
    customizationId: string;
  }>
) => {
  try {
    console.log("Data Recvd");
    console.log(customerId, orderTime, items);


    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/order`, {
      method: "POST",
      body: JSON.stringify({ customerId, orderTime, items }),
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCustomerOrders = async (
  customerId: string,
  year: number,
  month: number,
  orderStatus: string = "BOTH"
) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/order/${customerId}?year=${year}&month=${month}&paid=${orderStatus}`,
      {
        method: "GET",
        headers: NODE_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch customer orders: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};

export const markOrderAsPaid = async (orderId: string) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/order/${orderId}/mark-paid`,
      {
        method: "PUT",
        headers: NODE_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark order as paid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking order as paid:", error);
    throw error;
  }
};

export const markMultipleOrdersAsPaid = async (orderIds: string[]) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/order/mark-multiple-paid`,
      {
        method: "PUT",
        headers: NODE_CONFIG.headers,
        body: JSON.stringify({ orderIds }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark orders as paid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking multiple orders as paid:", error);
    throw error;
  }
};

export const markOrderAsUnpaid = async (orderId: string) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/order/${orderId}/mark-unpaid`,
      {
        method: "PUT",
        headers: NODE_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark order as unpaid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking order as unpaid:", error);
    throw error;
  }
};


// Dashboard Functions
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/dashboard/stats`, {
      method: "GET",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};


// Payments
export const getCustomersWithPendingPayments = async () => {
  try {
    const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/dashboard/pending-payments`, {
      method: "GET",
      headers: NODE_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pending payments: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customers with pending payments:", error);
    throw error;
  }
};

export const getCustomerPendingPayments = async (customerId: string) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/dashboard/pending-payments/${customerId}`,
      {
        method: "GET",
        headers: NODE_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch customer pending payments: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer pending payments:", error);
    throw error;
  }
};

export const markAllCustomerPaymentsAsPaid = async (customerId: string) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/dashboard/mark-all-paid/${customerId}`,
      {
        method: "PUT",
        headers: NODE_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark all payments as paid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking all payments as paid:", error);
    throw error;
  }
};

export const markMonthPaymentAsPaid = async (
  customerId: string,
  year: number,
  month: number
) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/dashboard/mark-month-paid/${customerId}`,
      {
        method: "PUT",
        headers: {
          ...NODE_CONFIG.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark month payment as paid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking month payment as paid:", error);
    throw error;
  }
};

export const markMonthPaymentAsUnpaid = async (
  customerId: string,
  year: number,
  month: number
) => {
  try {
    const response = await fetch(
      `${NODE_CONFIG.BASE_URL}/api/dashboard/mark-month-unpaid/${customerId}`,
      {
        method: "PUT",
        headers: {
          ...NODE_CONFIG.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark month payment as unpaid: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking month payment as unpaid:", error);
    throw error;
  }
};
