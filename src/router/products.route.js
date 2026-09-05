import express from "express";
import { getAllProducts, addProduct, deleteProduct } from '../controllers/product.controller.js'

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/add", addProduct);
router.delete("/delete/:id", deleteProduct);

export default router;