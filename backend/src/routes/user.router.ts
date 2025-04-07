import express, { Express, Router, Request, Response } from "express";

const router: Router = express.Router();
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
})
export default router;