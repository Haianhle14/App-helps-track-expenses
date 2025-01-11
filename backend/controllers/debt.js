const DebtSchema = require('../models/DebtModel');

// Thêm nợ mới
exports.addDebt = async (req, res) => {
    const { type, amount, borrower, lender, description, dueDate } = req.body;

    const debt = new DebtSchema({
        type,
        amount,
        borrower,
        lender,
        description,
        dueDate,
    });

    try {
        // Kiểm tra dữ liệu
        if (!type || !amount || !dueDate) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        await debt.save();
        res.status(200).json({ message: 'Debt Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

    console.log(debt);
};

// Lấy danh sách nợ
exports.getDebts = async (req, res) => {
    try {
        const debts = await DebtSchema.find().sort({ createdAt: -1 });
        res.status(200).json(debts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Xóa nợ
exports.deleteDebt = async (req, res) => {
    const { id } = req.params;

    DebtSchema.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({ message: 'Debt Deleted' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Server Error' });
        });
};
