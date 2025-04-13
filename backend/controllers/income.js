const IncomeModel = require('../models/IncomeModel')

// Thêm thu nhập mới
exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date, userId } = req.body

  try {
    if (!title || !category || !date || !userId) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc!' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền phải là một số dương!' })
    }

    const income = new IncomeModel({
      title,
      amount,
      category,
      description,
      date,
      userId
    })

    await income.save()
    res.status(200).json({ message: 'Thu nhập đã được thêm thành công!' })
  } catch (error) {
    console.error('addIncome error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
  console.log('req.body:', req.body)
}

// Lấy danh sách thu nhập theo userId
exports.getIncomes = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) {
      return res.status(400).json({ message: 'Thiếu userId trong query!' })
    }

    const incomes = await IncomeModel.find({ userId }).sort({ createdAt: -1 })
    res.status(200).json(incomes)
  } catch (error) {
    console.error('getIncomes error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}

// Xoá thu nhập
exports.deleteIncome = async (req, res) => {
  const { id } = req.params

  try {
    const deletedIncome = await IncomeModel.findByIdAndDelete(id)

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Không tìm thấy thu nhập!' })
    }

    res.status(200).json({ message: 'Thu nhập đã được xoá!' })
  } catch (error) {
    console.error('deleteIncome error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}
