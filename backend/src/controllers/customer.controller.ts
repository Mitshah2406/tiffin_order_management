import { Request, Response } from 'express';
import JsonResponse from '../helpers/json.response';
import Customer from '../models/customer.model';
class CustomerController {
    static async create(req: Request, res: Response) {
        const { name, mobileNumber } = req.body;
        const customer = new Customer()
        const data = await customer.create(name, mobileNumber);
        return new JsonResponse(req, res).jsonSuccess(data, "Customer created successfully");
    }
    static async getAll(req: Request, res: Response) {
        const customer = new Customer()
        const data = await customer.getAll();
        return new JsonResponse(req, res).jsonSuccess(data, "Customer fetched successfully");
    }
}

export default CustomerController;