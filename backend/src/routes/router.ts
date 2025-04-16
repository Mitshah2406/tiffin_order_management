import express, { Router } from 'express';
import customerRouter from "./customer.router";
import productRouter from "./product.router";
import customizationsRouter from "./customizations.router";
import dashboardRoutes from "./dashboard.router";
import adminRoutes from "./admin.router";

import orderRouter from "./order.router";
const router: Router = express.Router();



router.get("/health", (req, res) => {
    res.status(200).json({ message: "Health check" });
})

router.use("/api",
    router.use("/customer", customerRouter),
    router.use("/product", productRouter),
    router.use("/customizations", customizationsRouter),
    router.use("/order", orderRouter),
    router.use("/dashboard", dashboardRoutes),
    router.use("/admin", adminRoutes)
);
export default router;