import { Request, Response } from 'express';
import JsonResponse from '../helpers/json.response';
import Order from '../models/order.model';

class AdminOrderController {
    static async getAll(req: Request, res: Response) {
        try {
            const order = new Order();
            const data = await order.getAllOrders();
            return new JsonResponse(req, res).jsonSuccess(data, "Orders fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch orders", 500);
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = new Order();
            const data = await order.getById(id);

            if (!data) {
                return new JsonResponse(req, res).jsonError("Order not found", 404);
            }

            return new JsonResponse(req, res).jsonSuccess(data, "Order fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch order", 500);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            console.log("Request body received:", req.body); // Added for debugging

            const { id } = req.params;
            const { orderTime, orderStatus, items, totalAmount } = req.body;

            const order = new Order();
            const existingOrder = await order.getById(id);

            if (!existingOrder) {
                return new JsonResponse(req, res).jsonError("Order not found", 404);
            }

            // Pass all the data to your update method
            const data = await order.update(id, orderTime, orderStatus, items, totalAmount);
            return new JsonResponse(req, res).jsonSuccess(data, "Order updated successfully");
        } catch (error) {
            console.error("Error updating order:", error);
            return new JsonResponse(req, res).jsonError("Failed to update order", 500);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const order = new Order();
            const existingOrder = await order.getById(id);

            if (!existingOrder) {
                return new JsonResponse(req, res).jsonError("Order not found", 404);
            }

            // First delete the order items
            await order.deleteOrderItems(id);

            // Then delete the order
            const data = await order.delete(id);
            return new JsonResponse(req, res).jsonSuccess(data, "Order deleted successfully");
        } catch (error) {
            console.error("Error deleting order:", error);
            return new JsonResponse(req, res).jsonError("Failed to delete order", 500);
        }
    }
}

export default AdminOrderController;