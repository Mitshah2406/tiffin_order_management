import prisma from "../config/prisma";

class Product {
    async addProduct(name: string) {
        const productExists = await prisma.getClient().product.findFirst({
            where: {
                name: name,
            }
        });

        if (productExists) {
            throw new Error("Product already exists");
        }

        const product = await prisma.getClient().product.create({
            data: {
                name: name,
            },
        });
        return product;
    }
    async editProduct(id: string, name: string) {
        const productExists = await prisma.getClient().product.findFirst({
            where: {
                id: id,
            }
        });

        if (!productExists) {
            throw new Error("Product does not exist");
        }

        const product = await prisma.getClient().product.update({
            where: {
                id: id,
            },
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

    // async getProductWithCustomization() {
    //     console.log("bc");

    //     const products = await prisma.getClient().product.findMany(
    //         {
    //             include: {
    //                 Customizations: true,
    //             }
    //         }
    //     );
    //     return products;
    // }
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
        const prismaClient = prisma.getClient();

        await prismaClient.customizations.deleteMany({
            where: {
                productId: id,
            },
        });

        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: id,
            },
        });

        return deletedProduct;
    }
}

export default Product;