import express, { Router } from 'express';
import TryCatch from '../helpers/try-catch';
import customizationsController from '../controllers/customizations.controller';

const router: Router = express.Router();
router.post("/", new TryCatch(customizationsController.create).tryCatchGlobe());
router.delete("/:id", new TryCatch(customizationsController.delete).tryCatchGlobe());
export default router;