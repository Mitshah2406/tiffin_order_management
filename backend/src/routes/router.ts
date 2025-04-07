import express, { Router } from 'express';
import userRouter from "./user.router";
const router: Router = express.Router();



router.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
})

router.use("/api",
    router.use("/customer", userRouter)
);
export default router;