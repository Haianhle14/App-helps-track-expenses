const SavingSchema = require('../models/SavingModel');

// Thêm mục tiêu tiết kiệm
exports.addSaving = async (req, res) => {
    const { goal, targetAmount, currentAmount } = req.body;

    const saving = new SavingSchema({
        goal,
        targetAmount,
        currentAmount: currentAmount || 0,
    });

    try {
        // Kiểm tra dữ liệu
        if (!goal || !targetAmount) {
            return res.status(400).json({ message: 'Tên mục tiêu và số tiền mục tiêu là bắt buộc!' });
        }
        if (targetAmount <= 0) {
            return res.status(400).json({ message: 'Số tiền mục tiêu phải là số dương!' });
        }

        // Lưu vào cơ sở dữ liệu và trả về toàn bộ đối tượng, bao gồm cả _id
        const savedSaving = await saving.save();
        res.status(200).json(savedSaving);  // Trả về toàn bộ đối tượng (bao gồm _id)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
    console.log(saving);
};

// Lấy danh sách mục tiêu tiết kiệm
exports.getSavings = async (req, res) => {
    try {
        const savings = await SavingSchema.find().sort({ createdAt: -1 }).lean();
        const mappedSavings = savings.map(saving => ({
            id: saving._id.toString(), // Chuyển _id thành id
            goal: saving.goal,
            targetAmount: saving.targetAmount,
            currentAmount: saving.currentAmount,
        }));
        res.status(200).json(mappedSavings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
};



// Cập nhật tiến độ tiết kiệm
exports.updateSavingProgress = async (req, res) => {
    const { id } = req.params;
    const { currentAmount } = req.body;

    try {
        const saving = await SavingSchema.findOne({ _id: id }).lean();

        if (!saving) {
            return res.status(404).json({ message: 'Mục tiêu không tồn tại!' });
        }

        await SavingSchema.updateOne({ _id: id }, { $set: { currentAmount } });

        res.status(200).json({ message: 'Cập nhật tiến độ thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
};


// Xóa mục tiêu tiết kiệm
exports.deleteSaving = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID không hợp lệ!' });
    }

    try {
        await SavingSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Mục tiêu tiết kiệm đã được xóa!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
};

