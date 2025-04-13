import express, { Express, Router, Request, Response } from "express";
import TryCatch from "../helpers/try-catch";
import customerController from "../controllers/customer.controller";

const router: Router = express.Router();
router.post("/", new TryCatch(customerController.create).tryCatchGlobe());
router.get("/", new TryCatch(customerController.getAll).tryCatchGlobe());

export default router;