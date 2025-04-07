import { Request, Response } from "express";
import Customization from "../models/customizations.model";
import JsonResponse from "../helpers/json.response";
class CustomizationsController {
    static async create(req: Request, res: Response) {
        const {
            description, price, productId
        } = req.body;

        const customization = new Customization();
        const data = await customization.create(description, price, productId);
        return new JsonResponse(req, res).jsonSuccess(data, "Customization created successfully");
    }
    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const customization = new Customization();
        const data = await customization.delete(id)
        return new JsonResponse(req, res).jsonSuccess(data, "Customization deleted successfully");
    }
}
export default CustomizationsController;