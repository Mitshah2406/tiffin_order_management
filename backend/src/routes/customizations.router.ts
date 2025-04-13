import express, { Router } from 'express';
import TryCatch from '../helpers/try-catch';
import customizationsController from '../controllers/customizations.controller';

const router: Router = express.Router();

router.post("/", new TryCatch(customizationsController.create).tryCatchGlobe());
router.get("/", new TryCatch(customizationsController.getAll).tryCatchGlobe());
router.put("/:id", new TryCatch(customizationsController.edit).tryCatchGlobe());
router.delete("/:id", new TryCatch(customizationsController.delete).tryCatchGlobe());
router.get("/product/getProductsWithCustomization", new TryCatch(customizationsController.getProductWithCustomization).tryCatchGlobe());



export default router;