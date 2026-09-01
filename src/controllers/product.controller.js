import ProductSchema from "../models/product.model.js";
/**
 * @desc Get all products
 * @route GET /api/data/products
 * @access Public
 */
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find();
        res.status(200).json( products );
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
/**
 * @desc Add a new product
 * @route POST /api/data/add
 * @access Private (Admin only)
 */
export const addProduct = async (req, res) => {
    try {
        const {
            title,
            category,
            dressCode,
            gender,
            style,
            image,
            images,
            description,
            rating,
            price,
            originalPrice,
            discount,
            isTopSelling,
            colors
        } = req.body;

        // Basic Validation: Check for required fields
        if (!title || !category || !dressCode || !gender || !image || price === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill in all required fields (title, category, dressCode, gender, image, price)." 
            });
        }

        // Create and save product in MongoDB
        const newProduct = await ProductSchema.create({
            title,
            category,
            dressCode,
            gender,
            style,
            image,
            images,
            description,
            rating,
            price,
            originalPrice,
            discount,
            isTopSelling,
            colors
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct
        });

    } catch (error) {
        // Mongoose validation error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation Error", 
                error: error.message 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
/**
 * @desc Delete a product by ID
 * @route DELETE /api/data/delete/:id
 * @access Private (Admin only)
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductSchema.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
