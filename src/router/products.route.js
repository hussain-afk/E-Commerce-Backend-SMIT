import express from "express";
import { getAllProducts, addProduct } from '../controllers/product.controller.js'

const router = express.Router();

router.get("/products", getAllProducts);
router.post("/add", addProduct);


export default router;