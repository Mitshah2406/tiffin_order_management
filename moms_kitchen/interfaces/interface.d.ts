export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    customizationId: string;
    orderId: string;
    product: {
        id: string;
        name: string;
    };
}

export interface Order {
    id: string;
    orderTime: string;
    orderDate: string;
    customerId: string;
    orderAmount: number;
    orderStatus: string;
    totalItems: number;
    createdAt: string;
    customer: {
        id: string;
        name: string;
        mobileNumber: number;
    };
    Item: OrderItem[];
}

export interface Customer {
    id?: string;
    name: string;
    mobileNumber: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Customization {
    id?: string;
    description: string;
    price: string;
    productId: string;
    product?: {
        id: string;
        name: string;
    }
}

export interface Product {
    id?: string;
    name: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    customizationId: string;
}

export interface OrderData {
    customerId: string;
    orderTime: string;
    items: OrderItem[];
}



export interface NodeResponse {
    success: boolean;
    data: any;
    message: string;
}