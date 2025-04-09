const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến bảng User
        required: true
      },
    type: {
        type: String, // 'borrow' hoặc 'lend'
        required: true,
        enum: ['borrow', 'lend'], // borrow: nợ vay, lend: nợ cho vay
    },
    amount: {
        type: Number,
        required: true,
    },
    borrower: {
        type: String,
        required: function() { return this.type === 'lend'; }, // Chỉ cần khi nợ cho vay
    },
    lender: {
        type: String,
        required: function() { return this.type === 'borrow'; }, // Chỉ cần khi nợ vay
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
