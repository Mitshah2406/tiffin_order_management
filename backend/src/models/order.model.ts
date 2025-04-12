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
    // async getAllOfCustomer(customerId: string, year: number, month: number, paid: string) {
    //     // get all orders with total amount earned for current month
    //     let orders = []
    //     if (paid == "BOTH") {
    //         orders = await prisma.getClient().order.findMany({
    //             where: {
    //                 createdAt: {
    //                     gte: new Date(new Date().getFullYear(), month, 1),
    //                     lte: new Date(new Date().getFullYear(), month + 1, 0),
    //                 },
    //                 customerId: customerId,
    //             },
    //             include: {
    //                 customer: true,
    //                 Item: {
    //                     include: {
    //                         product: true,
    //                     }
    //                 }
    //             }
    //         });
    //     } else {
    //         orders = await prisma.getClient().order.findMany({
    //             where: {
    //                 createdAt: {
    //                     gte: new Date(new Date().getFullYear(), month, 1),
    //                     lte: new Date(new Date().getFullYear(), month + 1, 0),
    //                 },
    //                 customerId: customerId,
    //                 orderStatus: paid == "PAID" ? "PAID" : "UNPAID"
    //             },
    //             include: {
    //                 customer: true,
    //                 Item: {
    //                     include: {
    //                         product: true,
    //                     }
    //                 }
    //             }
    //         });
    //     }

    //     // extract the total amount earned for current month
    //     const totalAmount = orders.reduce((acc, order) => acc + order.orderAmount, 0);
    //     // extract unpaid amount
    //     if (paid == "BOTH") {
    //         const unpaidOrders = orders.filter(order => order.orderStatus === 'UNPAID');
    //         const unpaidAmount = unpaidOrders.reduce((acc, order) => acc + order.orderAmount, 0);
    //         return { orders, totalAmount, unpaidAmount, paidAmount: totalAmount - unpaidAmount };
    //     } else {
    //         return { orders, totalAmount, unpaidAmount: -1, paidAmount: -1 };
    //     }
    // }


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

        if (paid === "BOTH") {
            orders = await prisma.getClient().order.findMany({
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
                            product: true,
                        }
                    }
                },
                orderBy: {
                    orderDate: 'desc'
                }
            });
        } else {
            orders = await prisma.getClient().order.findMany({
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
                            product: true,
                        }
                    }
                },
                orderBy: {
                    orderDate: 'desc'
                }
            });
        }

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
}
export default Order;