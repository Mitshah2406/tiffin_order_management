import prisma from "../config/prisma";

class Product {
    async addProduct(name: string) {
        const product = await prisma.getClient().product.create({
            data: {
                name: name,
            },
        });
        return product;
    }
    async getAll() {
        const products = await prisma.getClient().product.findMany(
            {
                include: {
                    Customizations: true,
                }
            }
        );
        return products;
    }
    async getById(id: string) {
        const products = await prisma.getClient().product.findUnique(
            {
                where: {
                    id: id,
                },
                include: {
                    Customizations: true,
                }
            }
        );
        return products;
    }
    async delete(id: string) {
        const products = await prisma.getClient().product.delete(
            {
                where: {
                    id: id,
                }
            }
        );
        return products;
    }
}

export default Product;