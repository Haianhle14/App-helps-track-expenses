const ExpenseModel = require('../models/ExpenseModel')

// Thêm chi tiêu mới
exports.addExpense = async (req, res) => {
  let { title, subCategory, amount, category, description, date, userId } = req.body

  try {
    // Ưu tiên title nếu có, nếu không dùng subCategory
    title = title || subCategory

    if (!title || !category || !date || !userId) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc!' })
    }

    // Convert amount về number (phòng khi client gửi dạng string)
    amount = Number(amount)
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền phải là một số dương!' })
    }

    const expense = new ExpenseModel({
      title,
      amount,
      category,
      description,
      date,
      userId
    })

    await expense.save()
    res.status(200).json({ message: 'Chi tiêu đã được thêm thành công!' })
  } catch (error) {
    console.error('addExpense error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}

// Lấy danh sách chi tiêu theo userId
exports.getExpense = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId trong query!' })

    const expenses = await ExpenseModel.find({ userId }).sort({ createdAt: -1 })
    res.status(200).json(expenses)
  } catch (error) {
    console.error('getExpense error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}

// Xoá chi tiêu
exports.deleteExpense = async (req, res) => {
  const { id } = req.params
  const { userId } = req.query

  try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId trong query!' })

    const deletedExpense = await ExpenseModel.findOneAndDelete({ _id: id, userId })

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiêu!' })
    }

    res.status(200).json({ message: 'Chi tiêu đã được xoá!' })
  } catch (error) {
    console.error('deleteExpense error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}
