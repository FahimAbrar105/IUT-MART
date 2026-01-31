const mongoose = require('mongoose');

// Limit Order Schema
const LimitOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sector: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Other'] // Align with Product categories
    },
    maxPrice: { // The "Strike Price"
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'FILLED', 'CANCELLED'],
        default: 'ACTIVE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LimitOrder', LimitOrderSchema);
