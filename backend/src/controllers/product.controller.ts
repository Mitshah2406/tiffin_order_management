import { Request, Response } from 'express';
import Product from '../models/product.model';
import JsonResponse from '../helpers/json.response';
class ProductController {
    static async addProduct(req: Request, res: Response) {
        const {
            name
        } = req.body;
        const product = new Product()
        const data = await product.addProduct(name);

        return new JsonResponse(req, res).jsonSuccess(data, "Product added successfully");
    }

    static async getAll(req: Request, res: Response) {
        const product = new Product()
        const data = await product.getAll();

        return new JsonResponse(req, res).jsonSuccess(data, "Products fetched successfully");
    }
    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const product = new Product()
        const data = await product.getById(id);

        return new JsonResponse(req, res).jsonSuccess(data, "Product fetched successfully");
    }
    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const product = new Product()
        const data = await product.delete(id);

        return new JsonResponse(req, res).jsonSuccess(data, "Product deleted successfully");
    }

}

export default ProductController;