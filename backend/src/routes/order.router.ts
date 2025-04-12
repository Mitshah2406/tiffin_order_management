import express, { Router } from "express";
import TryCatch from "../helpers/try-catch";
import orderController from "../controllers/order.controller";
const router: Router = express.Router();

router.post("/", new TryCatch(orderController.createOrder).tryCatchGlobe())
router.get("/", new TryCatch(orderController.getAll).tryCatchGlobe())
router.get("/:customerId", new TryCatch(orderController.getAllOfCustomer).tryCatchGlobe())
router.put("/:id/mark-paid", new TryCatch(orderController.markPaid).tryCatchGlobe());
router.put("/:id/mark-unpaid", new TryCatch(orderController.markUnpaid).tryCatchGlobe());
router.put("/mark-multiple-paid", new TryCatch(orderController.markMultiplePaid).tryCatchGlobe());

export default router;