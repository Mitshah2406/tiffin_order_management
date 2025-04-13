import prisma from "../config/prisma";

class Customizations {
    async create(description: string, price: number, productId: string) {
        const customization = await prisma.getClient().customizations.create({
            data: {
                description: description,
                price: price,
                product: {
                    connect: {
                        id: productId,
                    }
                }
            }
        });
        return customization;
    }

    async getAll() {
        const customizations = prisma.getClient().customizations.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        return customizations;
    }

    async edit(id: string, productId: string, description: string, price: number) {
        const customization = await prisma.getClient().customizations.update({
            where: {
                id: id,
            },
            data: {
                productId: productId,
                description: description,
                price: price,
            }
        });
        return customization;
    }

    async delete(id: string) {
        const prismaClient = prisma.getClient();

        // First check if the customization is used in any orders
        const customizationUsageCount = await prismaClient.item.count({
            where: {
                customizationId: id,
            }
        });

        // If customization is in use, throw error or handle accordingly
        if (customizationUsageCount > 0) {
            throw new Error(
                `Cannot delete customization. It is being used in ${customizationUsageCount} order item(s).`
            );
        }

        // If it's safe to delete, proceed with deletion
        return await prismaClient.$transaction(async (tx) => {
            // Delete the customization
            const deletedCustomization = await tx.customizations.delete({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    productId: true,
                }
            });

            // Update the product to disconnect this customization
            await tx.product.update({
                where: {
                    id: deletedCustomization.productId,
                },
                data: {
                    Customizations: {
                        disconnect: {
                            id: id,
                        }
                    }
                }
            });

            return deletedCustomization;
        });
    }

    async getProductsWithCustomizations() {
        try {
            // First get all products
            const products = await prisma.getClient().product.findMany({
                include: {
                    Customizations: true, // Include the customizations relation
                },
            });

            // Filter to only include products that have at least one customization
            const productsWithCustomizations = products.filter(
                (product) => product.Customizations && product.Customizations.length > 0
            );

            return productsWithCustomizations;
        } catch (error) {
            throw error;
        }
    }
}

export default Customizations;