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
    static async getAll(req: Request, res: Response) {
        try {
            const customization = new Customization();
            const data = await customization.getAll();

            return new JsonResponse(req, res).jsonSuccess(data, "Customizations fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Error fetching customizations", 404);
        }
    }

    static async edit(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { productId, description, price } = req.body;

            console.log(productId, description, price);
            console.log(id);

            const customization = new Customization();
            const data = await customization.edit(id, productId, description, price);

            return new JsonResponse(req, res).jsonSuccess(data, "Customization updated successfully");
        } catch (error) {
            console.log(error);

            return new JsonResponse(req, res).jsonError("Error updating customization", 404);
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const customization = new Customization();
        const data = await customization.delete(id)
        return new JsonResponse(req, res).jsonSuccess(data, "Customization deleted successfully");
    }
}
export default CustomizationsController;