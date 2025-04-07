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
    async getAllOfCustomer(customerId: string) {
        // get all orders with total amount earned for current month
        const orders = await prisma.getClient().order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                },
                customerId: customerId
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
}
export default Order;