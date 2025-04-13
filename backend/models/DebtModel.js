const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    type: {
        type: String,
        required: true,
        enum: ['borrow', 'lend'], // borrow: nợ vay, lend: nợ cho vay
    },
    amount: {
        type: Number,
        required: true,
    },
    borrower: {
        type: String,
        required: function() { return this.type === 'lend'; },
    },
    lender: {
        type: String,
        required: function() { return this.type === 'borrow'; },
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Debt', DebtSchema);
