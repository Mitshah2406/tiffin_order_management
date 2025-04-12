import { Request, Response } from 'express';
import Product from '../models/product.model';
import JsonResponse from '../helpers/json.response';
class ProductController {
    static async addProduct(req: Request, res: Response) {
        try {
            const {
                name
            } = req.body;
            const product = new Product()
            const data = await product.addProduct(name);

            return new JsonResponse(req, res).jsonSuccess(data, "Product added successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Product Already Exist", 409);
        }
    }

    static async editProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                name
            } = req.body;
            const product = new Product()
            const data = await product.editProduct(id, name);

            return new JsonResponse(req, res).jsonSuccess(data, "Product updated successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Product does not exist", 409);
        }
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