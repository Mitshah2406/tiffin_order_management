import express, { Router } from "express";
import TryCatch from "../helpers/try-catch";
import orderController from "../controllers/order.controller";
const router: Router = express.Router();

router.post("/create", new TryCatch(orderController.createOrder).tryCatchGlobe())
router.get("/getAll", new TryCatch(orderController.getAll).tryCatchGlobe())
router.get("/:customerId", new TryCatch(orderController.getAllOfCustomer).tryCatchGlobe())

export default router;