import express, { Router } from "express";
import TryCatch from "../helpers/try-catch";
import adminOrderController from "../controllers/admin.order.controller";

const router: Router = express.Router();

router.get("/", new TryCatch(adminOrderController.getAll).tryCatchGlobe());
router.get("/:id", new TryCatch(adminOrderController.getById).tryCatchGlobe());
router.put("/:id", new TryCatch(adminOrderController.update).tryCatchGlobe());
router.delete("/:id", new TryCatch(adminOrderController.delete).tryCatchGlobe());

export default router;