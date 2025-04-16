import express, { Router } from "express";
import TryCatch from "../helpers/try-catch";
import adminController from "../controllers/adminController";
import adminCustomerRouter from "./admin.customer.router";
import adminOrderRouter from "./admin.order.router";

const router: Router = express.Router();

router.post("/login", new TryCatch(adminController.login).tryCatchGlobe());
router.use("/customer", adminCustomerRouter);
router.use("/order", adminOrderRouter);



export default router;