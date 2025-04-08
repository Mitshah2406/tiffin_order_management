import express, { Express, Router, Request, Response } from "express";
import TryCatch from "../helpers/try-catch";
import customerController from "../controllers/customer.controller";

const router: Router = express.Router();
router.post("/create", new TryCatch(customerController.create).tryCatchGlobe());
router.get("/getAll", new TryCatch(customerController.getAll).tryCatchGlobe());
export default router;