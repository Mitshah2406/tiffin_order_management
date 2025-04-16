import prisma from "../config/prisma";

class Customer {
    async create(name: string, mobileNumber: number) {
        const customer = await prisma.getClient().customer.create({
            data: {
                name: name,
                mobileNumber: mobileNumber,
            },
        });
        return customer;
    }

    async getAll() {
        const customers = await prisma.getClient().customer.findMany(
            {
                include: {
                    Order: true,
                }
            }
        );
        return customers;
    }

    async getById(id: string) {
        const customer = await prisma.getClient().customer.findUnique({
            where: {
                id: id
            },
            include: {
                Order: true
            }
        });
        return customer;
    }

    async update(id: string, name: string, mobileNumber: number) {
        const customer = await prisma.getClient().customer.update({
            where: {
                id: id
            },
            data: {
                name: name,
                mobileNumber: mobileNumber,
                updatedAt: new Date()
            }
        });
        return customer;
    }

    async delete(id: string) {
        // First, check if the customer has any orders
        const customerWithOrders = await prisma.getClient().customer.findUnique({
            where: {
                id: id
            },
            include: {
                Order: true
            }
        });

        // If customer has orders, throw an error
        if (customerWithOrders && customerWithOrders.Order.length > 0) {
            throw new Error("Cannot delete customer with existing orders");
        }

        // If no orders, proceed with deletion
        const customer = await prisma.getClient().customer.delete({
            where: {
                id: id
            }
        });
        return customer;
    }
}

export default Customer;