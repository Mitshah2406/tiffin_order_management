// models/dashboard.model.ts

import { Customer } from "@prisma/client";
import prisma from "../config/prisma";

interface Order {
    id: string;
    orderDate: string | Date;
    orderAmount: number;
    customerId: string;
    orderStatus: string;
    customer?: {
        id: string;
        name: string;
        createdAt: Date;
        mobileNumber: number;
        updatedAt: Date;
    } | null;
}

interface MonthEntry {
    month: string;
    year: number;
    amount: number;
}

interface CustomerData {
    id: string;
    name: string;
    pendingMonths: MonthEntry[];
    totalAmount: number;
    customer: Customer;
}

interface MonthData {
    month: string;
    year: number;
    amount: number;
    orders: string[];
    status?: string;
}

interface DashboardStats {
    counts: {
        products: number;
        customizations: number;
        customers: number;
        orders: number,
    };
    financial: {
        earnedAmount: number;
        pendingAmount: number;
        unpaidAmount: number,
    };
}

interface CustomerPendingPayments {
    customer: {
        id: string;
        name: string;
    };
    pendingMonths: MonthData[];
    totalAmount: number;
}

interface MarkPaymentResult {
    customerId: string;
    updatedCount: number;
    year?: number;
    month?: number;
}

export class Dashboard {
    /**
     * Get dashboard statistics including counts and financial summary
     */
    async getStats(): Promise<DashboardStats> {
        const prismaClient = prisma.getClient();

        // Get counts
        const [productCount, customizationCount, customerCount] = await Promise.all([
            prismaClient.product.count(),
            prismaClient.customizations.count(),
            prismaClient.customer.count(),
        ]);

        // Get total earned amount (all paid orders)
        const paidOrders = await prismaClient.order.findMany({
            where: {
                orderStatus: "PAID",
            }
        }) as Order[];

        const earnedAmount = paidOrders.reduce((sum: number, order: Order) => sum + order.orderAmount, 0);

        // Get total pending amount (all unpaid orders excluding current month)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const unpaidOrders = await prismaClient.order.findMany({
            where: {
                orderStatus: "UNPAID",
                orderDate: {
                    lt: new Date(currentYear, currentMonth, 1) // Orders before current month
                }
            }
        }) as Order[];

        const pendingAmount = unpaidOrders.reduce((sum: number, order: Order) => sum + order.orderAmount, 0);

        const countOrders = await prismaClient.order.count({});

        const allUnpaidOrders = await prismaClient.order.findMany({
            where: {
                orderStatus: "UNPAID",
            }
        }) as Order[];

        const unpaidAmount = allUnpaidOrders.reduce((sum: number, order: Order) => sum + order.orderAmount, 0);

        return {
            counts: {
                products: productCount,
                customizations: customizationCount,
                customers: customerCount,
                orders: countOrders,
            },
            financial: {
                earnedAmount,
                pendingAmount,
                unpaidAmount,
            }
        };
    }

    /**
     * Get all customers with pending payments (excluding current month)
     */
    async getCustomersWithPendingPayments(): Promise<CustomerData[]> {
        const prismaClient = prisma.getClient();

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Find all unpaid orders before the current month
        const unpaidOrders = await prismaClient.order.findMany({
            where: {
                orderStatus: "UNPAID",
                orderDate: {
                    lt: new Date(currentYear, currentMonth, 1) // Orders before current month
                }
            },
            include: {
                customer: true
            }
        }) as Order[];

        // Group by customer
        const customerMap = new Map<string, CustomerData>();

        unpaidOrders.forEach((order: Order) => {
            const customerId = order.customerId;
            const customer = order.customer;

            if (!customer) return;

            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth();
            const year = orderDate.getFullYear();

            // Convert month number to month name
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[month];

            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    id: customerId,
                    name: customer.name,
                    pendingMonths: [],
                    totalAmount: 0,
                    customer: customer,
                });
            }

            const customerData = customerMap.get(customerId) as CustomerData;

            // Check if month already exists
            let monthEntry = customerData.pendingMonths.find(m => m.month === monthName && m.year === year);

            if (!monthEntry) {
                monthEntry = {
                    month: monthName,
                    year: year,
                    amount: 0
                };
                customerData.pendingMonths.push(monthEntry);
            }

            // Add order amount to month and total
            monthEntry.amount += order.orderAmount;
            customerData.totalAmount += order.orderAmount;
        });

        console.log("Customer Map");


        console.log("Customer Map:", customerMap);


        return Array.from(customerMap.values());
    }

    /**
     * Get pending payments for a specific customer
     * @param customerId Customer ID to get pending payments for
     */
    async getCustomerPendingPayments(customerId: string): Promise<CustomerPendingPayments> {
        const prismaClient = prisma.getClient();

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Find the customer
        const customer = await prismaClient.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            throw new Error("Customer not found");
        }

        // Find all unpaid orders for this customer before the current month
        const unpaidOrders = await prismaClient.order.findMany({
            where: {
                customerId,
                orderStatus: "UNPAID",
                orderDate: {
                    lt: new Date(currentYear, currentMonth, 1) // Orders before current month
                }
            }
        }) as Order[];

        // Group by month and year
        const monthMap = new Map<string, MonthData>();

        unpaidOrders.forEach((order: Order) => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth();
            const year = orderDate.getFullYear();

            // Convert month number to month name
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[month];

            const key = `${year}-${month}`;

            if (!monthMap.has(key)) {
                monthMap.set(key, {
                    month: monthName,
                    year: year,
                    amount: 0,
                    orders: []
                });
            }

            const monthData = monthMap.get(key) as MonthData;
            monthData.amount += order.orderAmount;
            monthData.orders.push(order.id);
        });

        const pendingMonths = Array.from(monthMap.values());
        const totalAmount = pendingMonths.reduce((sum, month) => sum + month.amount, 0);

        return {
            customer: {
                id: customer.id,
                name: customer.name
            },
            pendingMonths,
            totalAmount
        };
    }

    /**
     * Mark all pending payments for a customer as paid
     * @param customerId Customer ID to mark all payments as paid
     */
    async markAllCustomerPaymentsAsPaid(customerId: string): Promise<MarkPaymentResult> {
        const prismaClient = prisma.getClient();

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Update all unpaid orders for this customer before the current month
        const result = await prismaClient.order.updateMany({
            where: {
                customerId,
                orderStatus: "UNPAID",
                orderDate: {
                    lt: new Date(currentYear, currentMonth, 1) // Orders before current month
                }
            },
            data: {
                orderStatus: "PAID"
            }
        });

        return {
            customerId,
            updatedCount: result.count
        };
    }

    /**
     * Mark a specific month's payments for a customer as paid
     * @param customerId Customer ID
     * @param year Year of the pending payment
     * @param month Month of the pending payment (0-11, where 0 is January)
     */
    async markMonthPaymentAsPaid(customerId: string, year: number, month: number): Promise<MarkPaymentResult> {
        const prismaClient = prisma.getClient();

        const result = await prismaClient.order.updateMany({
            where: {
                customerId,
                orderStatus: "UNPAID",
                orderDate: {
                    gte: new Date(year, month, 1),
                    lt: new Date(year, month + 1, 1)
                }
            },
            data: {
                orderStatus: "PAID"
            }
        });

        return {
            customerId,
            year,
            month,
            updatedCount: result.count
        };
    }

    /**
     * Mark a specific month's payments for a customer as unpaid
     * @param customerId Customer ID
     * @param year Year of the payment
     * @param month Month of the payment (0-11, where 0 is January)
     */
    async markMonthPaymentAsUnpaid(customerId: string, year: number, month: number): Promise<MarkPaymentResult> {
        const prismaClient = prisma.getClient();

        // Update all paid orders for this customer in the specified month
        const result = await prismaClient.order.updateMany({
            where: {
                customerId,
                orderStatus: "PAID",
                orderDate: {
                    gte: new Date(year, month, 1),
                    lt: new Date(year, month + 1, 1)
                }
            },
            data: {
                orderStatus: "UNPAID"
            }
        });

        return {
            customerId,
            year,
            month,
            updatedCount: result.count
        };
    }
}