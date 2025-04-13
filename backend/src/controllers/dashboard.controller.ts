// controllers/dashboard.controller.ts

import { Request, Response } from "express";
import JsonResponse from "../helpers/json.response";
import { Dashboard } from "../models/dashboard.model";

class DashboardController {

    static async getDashboardStats(req: Request, res: Response) {
        try {
            const dashboard = new Dashboard();
            const data = await dashboard.getStats();

            return new JsonResponse(req, res).jsonSuccess(data, "Dashboard stats fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch dashboard stats", 500);
        }
    }


    static async getCustomersWithPendingPayments(req: Request, res: Response) {
        try {
            const dashboard = new Dashboard();
            const data = await dashboard.getCustomersWithPendingPayments();

            return new JsonResponse(req, res).jsonSuccess(data, "Customers with pending payments fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch customers with pending payments", 500);
        }
    }

    static async getCustomerPendingPayments(req: Request, res: Response) {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return new JsonResponse(req, res).jsonError("Customer ID is required", 400);
            }

            const dashboard = new Dashboard();
            const data = await dashboard.getCustomerPendingPayments(customerId);

            return new JsonResponse(req, res).jsonSuccess(data, "Customer pending payments fetched successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to fetch customer pending payments", 500);
        }
    }


    static async markAllCustomerPaymentsAsPaid(req: Request, res: Response) {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return new JsonResponse(req, res).jsonError("Customer ID is required", 400);
            }

            const dashboard = new Dashboard();
            const data = await dashboard.markAllCustomerPaymentsAsPaid(customerId);

            return new JsonResponse(req, res).jsonSuccess(data, "All pending payments marked as paid successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to mark all payments as paid", 500);
        }
    }

    static async markMonthPaymentAsPaid(req: Request, res: Response) {
        try {
            const { customerId } = req.params;
            const { year, month } = req.body;

            if (!customerId || !year || !month) {
                return new JsonResponse(req, res).jsonError("Customer ID, year, and month are required", 400);
            }

            const dashboard = new Dashboard();
            const data = await dashboard.markMonthPaymentAsPaid(customerId, year, month);

            return new JsonResponse(req, res).jsonSuccess(data, "Month payment marked as paid successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to mark month payment as paid", 500);
        }
    }


    static async markMonthPaymentAsUnpaid(req: Request, res: Response) {
        try {
            const { customerId } = req.params;
            const { year, month } = req.body;

            if (!customerId || !year || !month) {
                return new JsonResponse(req, res).jsonError("Customer ID, year, and month are required", 400);
            }

            const dashboard = new Dashboard();
            const data = await dashboard.markMonthPaymentAsUnpaid(customerId, year, month);

            return new JsonResponse(req, res).jsonSuccess(data, "Month payment marked as unpaid successfully");
        } catch (error) {
            return new JsonResponse(req, res).jsonError("Failed to mark month payment as unpaid", 500);
        }
    }
}

export const dashboardController = DashboardController;