import AppConstants from "@/utils/constants";

export const NODE_CONFIG = {
    BASE_URL: AppConstants.IP,
    headers: {
        "Content-Type": "application/json",
    },
};

export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to login: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Admin Customer Functions
export const getAllCustomersAdmin = async () => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/customer`, {
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
};

export const getCustomerByIdAdmin = async (id: string) => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/customer/${id}`, {
            method: "GET",
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch customer: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateCustomerAdmin = async (id: string, name: string, mobileNumber: string) => {
    try {
        // Convert the mobile number to a number
        const mobileNo = parseInt(mobileNumber);

        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/customer/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name, mobileNumber: mobileNo }),
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to update customer: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCustomerAdmin = async (id: string) => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/customer/${id}`, {
            method: "DELETE",
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to delete customer: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Admin Order Functions
export const getAllOrdersAdmin = async () => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/order`, {
            method: "GET",
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getOrderByIdAdmin = async (id: string) => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/order/${id}`, {
            method: "GET",
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateOrderAdmin = async (id: string, orderTime: string, orderStatus: string, items?: any[], totalAmount?: number) => {
    try {
        const requestBody: any = { orderTime, orderStatus };

        // Add items and totalAmount if provided
        if (items) {
            requestBody.items = items;
        }

        if (totalAmount !== undefined) {
            requestBody.totalAmount = totalAmount;
        }

        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/order/${id}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to update order: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteOrderAdmin = async (id: string) => {
    try {
        const response = await fetch(`${NODE_CONFIG.BASE_URL}/api/admin/order/${id}`, {
            method: "DELETE",
            headers: NODE_CONFIG.headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to delete order: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};