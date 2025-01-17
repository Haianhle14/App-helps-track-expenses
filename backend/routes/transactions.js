const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addDebt, getDebts, deleteDebt } = require('../controllers/debt')
const { addSaving, getSavings, updateSavingProgress, deleteSaving } = require('../controllers/savings')

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .post('/add-debt', addDebt)
    .get('/get-debts', getDebts)
    .delete('/delete-debt/:id', deleteDebt)
    .post('/savings', addSaving) // Thêm mục tiêu tiết kiệm
    .get('/savings', getSavings) // Lấy danh sách mục tiêu
    .put('/savings/:id', updateSavingProgress) // Cập nhật tiến độ tiết kiệm
    .delete('/savings/:id', deleteSaving) // Xóa mục tiêu tiết kiệm

module.exports = router