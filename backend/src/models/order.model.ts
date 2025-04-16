import { OrderStatus, Timing } from "@prisma/client";
import prisma from "../config/prisma";


class Order {
    async getAll() {
        // get all orders with total amount earned for current month
        const orders = await prisma.getClient().order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                },
            },
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        // extract the total amount earned for current month
        const totalAmount = orders.reduce((acc, order) => acc + order.orderAmount, 0);
        // extract unpaid amount
        const unpaidOrders = orders.filter(order => order.orderStatus === 'UNPAID');
        const unpaidAmount = unpaidOrders.reduce((acc, order) => acc + order.orderAmount, 0);
        return { orders, totalAmount, unpaidAmount, paidAmount: totalAmount - unpaidAmount };
    }
    async markAsPaid(id: string) {
        const updatedOrder = await prisma.getClient().order.update({
            where: {
                id: id
            },
            data: {
                orderStatus: "PAID"
            },
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return updatedOrder;
    }
    async markAsUnpaid(id: string) {
        const updatedOrder = await prisma.getClient().order.update({
            where: {
                id: id
            },
            data: {
                orderStatus: "UNPAID"
            },
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return updatedOrder;
    }
    async markMultipleAsPaid(orderIds: string[]) {
        const updatedOrders = await prisma.getClient().order.updateMany({
            where: {
                id: {
                    in: orderIds
                },
                orderStatus: "UNPAID" // Only update orders that are currently unpaid
            },
            data: {
                orderStatus: "PAID"
            }
        });

        return {
            count: updatedOrders.count,
            orderIds
        };
    }
    async getAllOfCustomer(customerId: string, year: number, month: number, paid: string) {
        // Get all orders with total amount earned for selected month
        let orders = [];
        const prismaClient = prisma.getClient();

        if (paid === "BOTH") {
            orders = await prismaClient.order.findMany({
                where: {
                    customerId: customerId,
                    orderDate: {
                        gte: new Date(year, month, 1),
                        lt: new Date(year, month + 1, 0, 23, 59, 59, 999),
                    },
                },
                include: {
                    customer: true,
                    Item: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    orderDate: 'desc'
                }
            });
        } else {
            orders = await prismaClient.order.findMany({
                where: {
                    customerId: customerId,
                    orderDate: {
                        gte: new Date(year, month, 1),
                        lt: new Date(year, month + 1, 0, 23, 59, 59, 999),
                    },
                    orderStatus: paid == "PAID" ? "PAID" : "UNPAID"
                },
                include: {
                    customer: true,
                    Item: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    orderDate: 'desc'
                }
            });
        }

        // Get all customizationIds from the order items
        const customizationIds = orders.flatMap(order =>
            order.Item.map(item => item.customizationId)
        ).filter((id): id is string => id !== null);

        // Fetch all customizations in one query
        const customizations = await prismaClient.customizations.findMany({
            where: {
                id: {
                    in: customizationIds
                }
            }
        });

        // Create a map for quick lookup
        const customizationMap = new Map();
        customizations.forEach(customization => {
            customizationMap.set(customization.id, customization);
        });

        // Attach customization data to each order item
        orders = orders.map(order => {
            const itemsWithCustomization = order.Item.map(item => {
                return {
                    ...item,
                    customization: customizationMap.get(item.customizationId)
                };
            });
            return {
                ...order,
                Item: itemsWithCustomization
            };
        });

        // Calculate total amount for the month
        const totalAmount = orders.reduce((acc, order) => acc + order.orderAmount, 0);

        // Calculate unpaid amount if showing all orders
        if (paid === "BOTH") {
            const unpaidOrders = orders.filter(order => order.orderStatus === 'UNPAID');
            const unpaidAmount = unpaidOrders.reduce((acc, order) => acc + order.orderAmount, 0);
            return {
                orders,
                totalAmount,
                unpaidAmount,
                paidAmount: totalAmount - unpaidAmount
            };
        } else {
            return {
                orders,
                totalAmount,
                unpaidAmount: -1,
                paidAmount: -1
            };
        }
    }


    async getAllOrders() {
        const orders = await prisma.getClient().order.findMany({
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true,
                        customization: true,
                    },
                }
            },
            orderBy: {
                orderDate: 'desc'
            }
        });

        console.log("Orders");

        console.log(orders);


        return orders;
    }

    async getById(id: string) {
        // First get the order with its items and product relations
        const order = await prisma.getClient().order.findUnique({
            where: {
                id: id
            },
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) return null;

        // For each item, fetch the customization if needed
        const itemsWithCustomizations = await Promise.all(
            order.Item.map(async (item) => {
                if (item.customizationId) {
                    const customization = await prisma.getClient().customizations.findUnique({
                        where: { id: item.customizationId }
                    });

                    return {
                        ...item,
                        customization
                    };
                }
                return item;
            })
        );

        // Return the order with enhanced items
        return {
            ...order,
            Item: itemsWithCustomizations
        };
    }

    async update(id: string, orderTime: Timing, orderStatus: string, items?: any[], totalAmount?: number) {
        // First update the order basic info
        let totalItems = 0;

        for (const item of items!) {
            totalItems += item.quantity;
        }

        const updatedOrder = await prisma.getClient().order.update({
            where: { id },
            data: {
                orderTime,
                orderStatus: orderStatus as OrderStatus,
                orderAmount: totalAmount || undefined, // Use the new totalAmount if provided
                totalItems: totalItems // Update totalItems based on the new items array
            }
        });

        // If items are provided, update them
        if (items && items.length > 0) {
            // First delete existing items that are not in the new list
            const existingItems = await prisma.getClient().item.findMany({
                where: { orderId: id }
            });

            const existingItemIds = existingItems.map(item => item.id);
            const newItemIds = items.filter(item => item.id && !item.id.startsWith('temp-'))
                .map(item => item.id);

            // Delete items that are no longer in the list
            const itemsToDelete = existingItemIds.filter(id => !newItemIds.includes(id));
            if (itemsToDelete.length > 0) {
                await prisma.getClient().item.deleteMany({
                    where: { id: { in: itemsToDelete } }
                });
            }

            // Update or create items
            for (const item of items) {
                if (item.id && !item.id.startsWith('temp-')) {
                    // Update existing item
                    await prisma.getClient().item.update({
                        where: { id: item.id },
                        data: {
                            productId: item.productId,
                            customizationId: item.customizationId,
                            quantity: item.quantity
                        }
                    });
                } else {
                    // Create new item (for temp IDs or undefined IDs)
                    await prisma.getClient().item.create({
                        data: {
                            productId: item.productId,
                            customizationId: item.customizationId,
                            quantity: item.quantity,
                            orderId: id
                        }
                    });
                }
            }
        }

        // Fetch the updated order with its items
        const refreshedOrder = await prisma.getClient().order.findUnique({
            where: { id },
            include: {
                customer: true,
                Item: {
                    include: {
                        product: true,
                        customization: true
                    }
                }
            }
        });

        return refreshedOrder;
    }

    async createOrderItems(orderId: string, items: any[]) {
        const createdItems = [];

        for (const item of items) {
            // Create the item without including relations that might not exist
            const newItem = await prisma.getClient().item.create({
                data: {
                    productId: item.productId,
                    customizationId: item.customizationId,
                    quantity: item.quantity,
                    orderId: orderId,
                }
            });

            // If you need the product data, fetch it separately
            const product = await prisma.getClient().product.findUnique({
                where: { id: item.productId }
            });

            // If you need customization data and the ID exists, fetch it separately
            let customization = null;
            if (item.customizationId) {
                customization = await prisma.getClient().customizations.findUnique({
                    where: { id: item.customizationId }
                });
            }

            // Combine the data
            createdItems.push({
                ...newItem,
                product,
                customization
            });
        }

        return createdItems;
    }

    async deleteOrderItems(orderId: string) {
        await prisma.getClient().item.deleteMany({
            where: {
                orderId: orderId
            }
        });
    }

    async delete(id: string) {
        const order = await prisma.getClient().order.delete({
            where: {
                id: id
            }
        });
        return order;
    }
}
export default Order;