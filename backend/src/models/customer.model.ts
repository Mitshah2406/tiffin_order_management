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
}

export default Customer;