import { Request, Response } from 'express';
import JsonResponse from '../helpers/json.response';
import Customer from '../models/customer.model';


class CustomerController {
    static async create(req: Request, res: Response) {
        try {
            const { name, mobileNumber } = req.body;
            const customer = new Customer()
            const data = await customer.create(name, mobileNumber);
            return new JsonResponse(req, res).jsonSuccess(data, "Customer created successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to create customer", 500);
        }
    }
    static async getAll(req: Request, res: Response) {
        try {
            const customer = new Customer()
            const data = await customer.getAll();
            return new JsonResponse(req, res).jsonSuccess(data, "Customer fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch customers", 500);
        }
    }
}

export default CustomerController;