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

    async delete(id: string) {
        const customization = await prisma.getClient().customizations.delete({
            where: {
                id: id,
            },
            select: {
                id: true,
                productId: true,
            }
        });
        const product = await prisma.getClient().product.update({
            where: {
                id: customization.productId,
            },
            data: {
                Customizations: {
                    disconnect: {
                        id: id,
                    }
                }
            }
        })
        return customization;
    }
}

export default Customizations;