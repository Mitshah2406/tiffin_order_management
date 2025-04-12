import express, { Router } from 'express';
import Product from '../models/product.model';
import TryCatch from '../helpers/try-catch';
import productController from '../controllers/product.controller';

const router: Router = express.Router();

router.post("/", new TryCatch(productController.addProduct).tryCatchGlobe());
router.put("/:id", new TryCatch(productController.editProduct).tryCatchGlobe());

router.get("/", new TryCatch(productController.getAll).tryCatchGlobe());
router.get("/:id", new TryCatch(productController.getById).tryCatchGlobe());
router.delete("/:id", new TryCatch(productController.delete).tryCatchGlobe());

// router.get("/customization", new TryCatch(productController.getProductWithCustomization).tryCatchGlobe());


export default router;