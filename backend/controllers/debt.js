const DebtModel = require('../models/DebtModel')

// Thêm nợ mới
exports.addDebt = async (req, res) => {
  const { type, amount, borrower, lender, description, dueDate, userId } = req.body

  try {
    // Kiểm tra dữ liệu
    if (!type || !amount || !dueDate || !userId) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc!' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền phải là một số dương!' })
    }

    const debt = new DebtModel({
      type,
      amount,
      borrower,
      lender,
      description,
      dueDate,
      userId // 👈 Liên kết nợ với người dùng
    })

    await debt.save()
    res.status(200).json({ message: 'Khoản nợ đã được thêm thành công!' })
  } catch (error) {
    console.error('❌ addDebt error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}

// Lấy danh sách nợ của người dùng
exports.getDebts = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId trong query!' })

    const debts = await DebtModel.find({ userId }).sort({ createdAt: -1 })
    res.status(200).json(debts)
  } catch (error) {
    console.error('❌ getDebts error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}

// Xóa khoản nợ
exports.deleteDebt = async (req, res) => {
  const { id } = req.params
  const { userId } = req.query

  try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId trong query!' })

    const deleted = await DebtModel.findOneAndDelete({ _id: id, userId })

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy khoản nợ!' })
    }

    res.status(200).json({ message: 'Khoản nợ đã được xoá!' })
  } catch (error) {
    console.error('❌ deleteDebt error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}
