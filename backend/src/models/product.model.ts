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

        try {
            // First, check if there are any customizations for this product
            const customizationCount = await prismaClient.customizations.count({
                where: {
                    productId: id,
                },
            });

            if (customizationCount > 0) {
                throw new Error(
                    `This product has ${customizationCount} customization options. Please remove all customizations before deleting this product.`
                );
            }

            // Check if product is used in any orders
            const productUsageCount = await prismaClient.item.count({
                where: {
                    productId: id,
                },
            });

            if (productUsageCount > 0) {
                throw new Error(
                    `This product cannot be deleted because it is used in ${productUsageCount} order(s).`
                );
            }

            // If no customizations or orders use this product, proceed with deletion
            const deletedProduct = await prismaClient.product.delete({
                where: {
                    id: id,
                },
            });

            return deletedProduct;
        } catch (error) {
            // Re-throw the error to be handled by the API layer
            throw error;
        }
    }


}

export default Product;