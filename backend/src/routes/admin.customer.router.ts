import express, { Router } from "express";
import TryCatch from "../helpers/try-catch";
import adminCustomerController from "../controllers/admin.customer.controller";

const router: Router = express.Router();

router.get("/", new TryCatch(adminCustomerController.getAll).tryCatchGlobe());
router.get("/:id", new TryCatch(adminCustomerController.getById).tryCatchGlobe());
router.put("/:id", new TryCatch(adminCustomerController.update).tryCatchGlobe());
router.delete("/:id", new TryCatch(adminCustomerController.delete).tryCatchGlobe());

export default router;