import { Request, Response } from 'express';
import JsonResponse from '../helpers/json.response';
import Customer from '../models/customer.model';

class AdminCustomerController {
    static async getAll(req: Request, res: Response) {
        try {
            const customer = new Customer();
            const data = await customer.getAll();
            return new JsonResponse(req, res).jsonSuccess(data, "Customers fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch customers", 500);
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const customer = new Customer();
            const data = await customer.getById(id);

            if (!data) {
                return new JsonResponse(req, res).jsonError("Customer not found", 404);
            }

            return new JsonResponse(req, res).jsonSuccess(data, "Customer fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch customer", 500);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, mobileNumber } = req.body;

            const customer = new Customer();
            const existingCustomer = await customer.getById(id);

            if (!existingCustomer) {
                return new JsonResponse(req, res).jsonError("Customer not found", 404);
            }

            const data = await customer.update(id, name, mobileNumber);
            return new JsonResponse(req, res).jsonSuccess(data, "Customer updated successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to update customer", 500);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const customer = new Customer();
            const existingCustomer = await customer.getById(id);

            if (!existingCustomer) {
                return new JsonResponse(req, res).jsonError("Customer not found", 404);
            }

            const data = await customer.delete(id);
            return new JsonResponse(req, res).jsonSuccess(data, "Customer deleted successfully");
        } catch (error: any) {

            console.error("hee", error);
            return new JsonResponse(req, res).jsonError(error.message, 500);
        }
    }
}

export default AdminCustomerController;