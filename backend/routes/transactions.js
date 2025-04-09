const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addDebt, getDebts, deleteDebt } = require('../controllers/debt')
const { addSaving, getSavings, updateSavingProgress, deleteSaving } = require('../controllers/savings')
const { login, createNew, verifyAccount, getUserById } = require('../controllers/user')

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
    .post('/savings', addSaving) // Mục tiêu tiết kiệm
    .get('/savings', getSavings) 
    .put('/savings/:id', updateSavingProgress) 
    .delete('/savings/:id', deleteSaving)
    .post('/users/login', login) // Đăng nhập
    .post('/users/register', createNew) // Đăng ký tài khoản
    .put('/users/verify', verifyAccount) // Xác thực tài khoản 
    .get('/users/:id', getUserById);
module.exports = router