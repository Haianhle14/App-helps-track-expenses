const SavingModel = require('../models/SavingModel')

exports.addSaving = async (req, res) => {
  const { goal, targetAmount, currentAmount = 0, userId } = req.body

  try {
    // Kiểm tra đầu vào
    if (!goal || !targetAmount || !userId) {
      return res.status(400).json({ message: 'Thiếu thông tin mục tiêu hoặc userId!' })
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền mục tiêu phải là số dương!' })
    }

    const saving = new SavingModel({
      goal,
      targetAmount,
      currentAmount,
      userId,
    })

    const savedSaving = await saving.save()
    res.status(200).json({
      id: savedSaving._id.toString(),
      goal: savedSaving.goal,
      targetAmount: savedSaving.targetAmount,
      currentAmount: savedSaving.currentAmount,
    })
  } catch (error) {
    console.error('addSaving error:', error)
    res.status(500).json({ message: 'Lỗi máy chủ!' })
  }
}


// Lấy danh sách mục tiêu tiết kiệm theo user
exports.getSavings = async (req, res) => {
  const { userId } = req.query

  try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId trong query!' })

    const savings = await SavingModel.find({ userId }).sort({ createdAt: -1 }).lean()

    const mapped = savings.map(saving => ({
      id: saving._id.toString(),
            goal: saving.goal,
            targetAmount: saving.targetAmount,
            currentAmount: saving.currentAmount,
        }))

    res.status(200).json(mapped)
    } catch (error) {
    console.error('getSavings error:', error)
        res.status(500).json({ message: 'Lỗi máy chủ!' })
    }
}

// Cập nhật tiến độ tiết kiệm
exports.updateSavingProgress = async (req, res) => {
    const { id } = req.params
  const { currentAmount, userId } = req.body

    try {
    if (!userId) return res.status(400).json({ message: 'Thiếu userId!' })

    const saving = await SavingModel.findOne({ _id: id, userId })

        if (!saving) {
      return res.status(404).json({ message: 'Không tìm thấy mục tiêu tiết kiệm!' })
        }

    await SavingModel.updateOne({ _id: id, userId }, { $set: { currentAmount } })

        res.status(200).json({ message: 'Cập nhật tiến độ thành công!' })
    } catch (error) {
    console.error('updateSavingProgress error:', error)
        res.status(500).json({ message: 'Lỗi máy chủ!' })
    }
}

// Xóa mục tiêu tiết kiệm
exports.deleteSaving = async (req, res) => {
  const { id } = req.params
  console.log("ID to delete:", id)

  if (!id) {
    return res.status(400).json({ message: "Missing saving ID to delete" })
  }

  try {
    const deleted = await SavingModel.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: "Saving not found" })
    }
    res.status(200).json({ message: "Saving deleted successfully" })
  } catch (err) {
    console.error("deleteSaving error:", err)
    res.status(500).json({ message: "Internal server error" })
  }
}

