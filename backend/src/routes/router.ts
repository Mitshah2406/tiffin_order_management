import express, { Router } from 'express';
import userRouter from "./user.router";
import productRouter from "./product.router";
import customizationsRouter from "./customizations.router";
import orderRouter from "./order.router";
const router: Router = express.Router();



router.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
})

router.use("/api",
    router.use("/customer", userRouter),
    router.use("/product", productRouter),
    router.use("/customizations", customizationsRouter),
    router.use("/order", orderRouter),
);
export default router;