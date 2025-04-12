// controllers/dashboard.controller.ts

import { Request, Response } from "express";
import JsonResponse from "../helpers/json.response";
import { Dashboard } from "../models/dashboard.model";

class DashboardController {

    static async getDashboardStats(req: Request, res: Response) {
        const dashboard = new Dashboard();
        const data = await dashboard.getStats();

        return new JsonResponse(req, res).jsonSuccess(data, "Dashboard stats fetched successfully");
    }


    static async getCustomersWithPendingPayments(req: Request, res: Response) {
        const dashboard = new Dashboard();
        const data = await dashboard.getCustomersWithPendingPayments();

        return new JsonResponse(req, res).jsonSuccess(data, "Customers with pending payments fetched successfully");
    }

    static async getCustomerPendingPayments(req: Request, res: Response) {
        const { customerId } = req.params;

        if (!customerId) {
            return new JsonResponse(req, res).jsonError("Customer ID is required", 400);
        }

        const dashboard = new Dashboard();
        const data = await dashboard.getCustomerPendingPayments(customerId);

        return new JsonResponse(req, res).jsonSuccess(data, "Customer pending payments fetched successfully");
    }


    static async markAllCustomerPaymentsAsPaid(req: Request, res: Response) {
        const { customerId } = req.params;

        if (!customerId) {
            return new JsonResponse(req, res).jsonError("Customer ID is required", 400);
        }

        const dashboard = new Dashboard();
        const data = await dashboard.markAllCustomerPaymentsAsPaid(customerId);

        return new JsonResponse(req, res).jsonSuccess(data, "All pending payments marked as paid successfully");
    }

    static async markMonthPaymentAsPaid(req: Request, res: Response) {
        const { customerId } = req.params;
        const { year, month } = req.body;

        if (!customerId || !year || !month) {
            return new JsonResponse(req, res).jsonError("Customer ID, year, and month are required", 400);
        }

        const dashboard = new Dashboard();
        const data = await dashboard.markMonthPaymentAsPaid(customerId, year, month);

        return new JsonResponse(req, res).jsonSuccess(data, "Month payment marked as paid successfully");
    }


    static async markMonthPaymentAsUnpaid(req: Request, res: Response) {
        const { customerId } = req.params;
        const { year, month } = req.body;

        if (!customerId || !year || !month) {
            return new JsonResponse(req, res).jsonError("Customer ID, year, and month are required", 400);
        }

        const dashboard = new Dashboard();
        const data = await dashboard.markMonthPaymentAsUnpaid(customerId, year, month);

        return new JsonResponse(req, res).jsonSuccess(data, "Month payment marked as unpaid successfully");
    }
}

export const dashboardController = DashboardController;