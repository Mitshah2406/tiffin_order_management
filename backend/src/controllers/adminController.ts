import { Request, Response } from 'express';
import JsonResponse from '../helpers/json.response';
import Admin from '../models/admin.model';
import bcrypt from 'bcrypt';
import Customer from '../models/customer.model';
import Order from '../models/order.model';

class AdminController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return new JsonResponse(req, res).jsonError("Email and password are required", 400);
            }

            const admin = new Admin();
            const adminData = await admin.findByEmail(email);

            if (!adminData) {
                console.log("here 123");

                return new JsonResponse(req, res).jsonError("Invalid credentials", 401);
            }

            // Compare passwords
            console.log(password);
            console.log(adminData.password);
            console.log(bcrypt.compareSync(password, adminData.password));



            const isPasswordValid = await bcrypt.compareSync(password, adminData.password);

            if (!isPasswordValid) {
                console.log("here 423");

                return new JsonResponse(req, res).jsonError("Invalid credentials", 401);
            }

            // Remove password from response
            const { password: _, ...adminDataWithoutPassword } = adminData;

            return new JsonResponse(req, res).jsonSuccess(
                adminDataWithoutPassword,
                "Login successful"
            );
        } catch (error) {
            console.error("Login error:", error);
            return new JsonResponse(req, res).jsonError("Login failed", 500);
        }
    }
}

export default AdminController;