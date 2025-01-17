const mongoose = require('mongoose');

const SavingSchema = new mongoose.Schema(
    {
        goal: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        currentAmount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Saving', SavingSchema);
