// import { Request, Response } from "express";
// import Order from '../models/order.model';
// import JsonResponse from "../helpers/json.response";

// class OrderController {
//     static async createTransaction(req: Request, res: Response) {
//         const { customerId, timing, products, totalPrice } = req.body;

//         const order = new Order();
//         const data = await order.createOrder(customerId, timing, products, totalPrice);
//         return new JsonResponse(req, res).jsonSuccess(data, "Transaction created successfully");
//     }
// }

// export default OrderController;
import { Request, Response } from 'express';

import { Timing } from '@prisma/client';
import prisma from '../config/prisma';
import Order from '../models/order.model';
import JsonResponse from '../helpers/json.response';
class OrderController {
    // Create a new order with items
    static async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, orderTime, items, orderStatus } = req.body;

            // Validate request body
            if (!customerId) {
                res.status(400).json({ message: 'Customer ID is required' });
                return;
            }

            if (!orderTime || !Object.values(Timing).includes(orderTime)) {
                res.status(400).json({
                    message: 'Valid order time is required (MORNING, AFTERNOON, EVENING, or NIGHT)'
                });
                return;
            }

            if (!items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ message: 'Order must contain at least one item' });
                return;
            }

            // Check if customer exists
            const customer = await prisma.getClient().customer.findUnique({
                where: { id: customerId },
            });

            if (!customer) {
                res.status(404).json({ message: `Customer with ID ${customerId} not found` });
                return;
            }

            // Verify all products exist
            const productIds = items.map(item => item.productId);
            const products = await prisma.getClient().product.findMany({
                where: { id: { in: productIds } },
            });
            // Verify all products exist
            const customizationIds = items.map(item => item.customizationId);
            console.log('customizationIds', customizationIds);
            const prices = await prisma.getClient().customizations.findMany({
                where: { id: { in: customizationIds } },
                select: {
                    price: true,
                    id: true,
                    productId: true,
                }
            });
            console.log('prices', prices);

            // calculate total price according to each item quantity and its respective price
            let totalPrice = 0
            let totalItems = 0
            items.forEach(item => {
                const price = prices.find(price => price.id === item.customizationId);
                if (price) {
                    totalPrice += price.price * item.quantity;
                    totalItems += item.quantity;
                }
            });
            if (products.length !== [...new Set(productIds)].length) {
                res.status(404).json({ message: 'One or more products not found' });
                return;
            }

            // Create the order with items in a transaction
            const order = await prisma.getClient().$transaction(async (prisma) => {
                // Create the order first
                const newOrder = await prisma.order.create({
                    data: {
                        orderTime: orderTime,
                        customerId: customerId,
                        orderAmount: totalPrice,
                        orderStatus: orderStatus,
                        totalItems,
                    },
                });

                // Create all the items linked to this order
                for (const item of items) {
                    await prisma.item.create({
                        data: {
                            productId: item.productId,
                            quantity: item.quantity,
                            customizationId: item.customizationId,
                            orderId: newOrder.id,
                        },
                    });
                }

                // Return the complete order with items
                return prisma.order.findUnique({
                    where: { id: newOrder.id },
                    include: {
                        customer: true,
                        Item: {
                            include: {
                                product: true,
                            }
                            // select: {
                            //     customizationId: true,
                            //     quantity: true,
                            // }
                        },
                    },
                });
            });

            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Error creating order', error });
        }
    }


    static async getAll(req: Request, res: Response) {
        const order = new Order();
        const data = await order.getAll();
        return new JsonResponse(req, res).jsonSuccess(data, "Orders fetched successfully");
    }
    static async getAllOfCustomer(req: Request, res: Response) {
        const {
            month, paid
        } = req.query;
        const customerId = req.params.customerId;
        if (!customerId || !month || !paid) {
            return new JsonResponse(req, res).jsonError("Missing required parameters", 400);
        }
        const order = new Order();
        const data = await order.getAllOfCustomer(customerId, Number(month), paid.toString());
        return new JsonResponse(req, res).jsonSuccess(data, "Orders fetched successfully for customer");
    }

}

export default OrderController;