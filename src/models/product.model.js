import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    category: { 
        type: String, 
        required: true,
        lowercase: true 
    },
    dressCode: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['men', 'women', 'unisex'], 
        required: true,
        lowercase: true 
    },
    style: { 
        type: String 
    },
    image: { 
        type: String, 
        required: true 
    },
    images: [{ 
        type: String 
    }],
    description: { 
        type: String 
    },
    rating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5 
    },
    price: { 
        type: Number, 
        required: true 
    },
    originalPrice: { 
        type: Number, 
        default: null 
    },
    discount: { 
        type: Number, 
        default: null 
    },
    isTopSelling: { 
        type: Boolean, 
        default: false 
    },
    colors: [{ 
        type: String 
    }]
}, { 
    timestamps: true 
});
const Product = mongoose.model('Product', productSchema);

export default Product;