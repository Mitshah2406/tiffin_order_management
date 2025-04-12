import express, { Router } from 'express';
import TryCatch from '../helpers/try-catch';
import { dashboardController } from '../controllers/dashboard.controller';

const router: Router = express.Router();

router.get("/stats", new TryCatch(dashboardController.getDashboardStats).tryCatchGlobe());
router.get("/pending-payments", new TryCatch(dashboardController.getCustomersWithPendingPayments).tryCatchGlobe());
router.get("/pending-payments/:customerId", new TryCatch(dashboardController.getCustomerPendingPayments).tryCatchGlobe());
router.put("/mark-all-paid/:customerId", new TryCatch(dashboardController.markAllCustomerPaymentsAsPaid).tryCatchGlobe());
router.put("/mark-month-paid/:customerId", new TryCatch(dashboardController.markMonthPaymentAsPaid).tryCatchGlobe());
router.put("/mark-month-unpaid/:customerId", new TryCatch(dashboardController.markMonthPaymentAsUnpaid).tryCatchGlobe());

export default router;