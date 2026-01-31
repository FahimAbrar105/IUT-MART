const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Books', 'Electronics', 'Furniture', 'Clothing', 'Stationery', 'Other']
    },
    images: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Available', 'Sold'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Product', ProductSchema);
