const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addDebt, getDebts, deleteDebt } = require('../controllers/debt')
const { addSaving, getSavings, updateSavingProgress, deleteSaving } = require('../controllers/savings')
const { login, createNew, verifyAccount, getUserById, updateUser, changePassword,
    get2FAQrCode, verify2FA, setup2FA } = require('../controllers/user')

const router = require('express').Router();

// Income
router.post('/add-income', addIncome)
router.get('/get-incomes', getIncomes)
router.delete('/delete-income/:id', deleteIncome)

// Expense
router.post('/add-expense', addExpense)
router.get('/get-expenses', getExpense)
router.delete('/delete-expense/:id', deleteExpense)

// Debt
router.post('/add-debt', addDebt)
router.get('/get-debts', getDebts)
router.delete('/delete-debt/:id', deleteDebt)

// Saving
router.post('/savings', addSaving)
router.get('/savings', getSavings)
router.put('/savings/:id', updateSavingProgress)
router.delete('/savings/:id', deleteSaving)

// User
router.post('/users/login', login)
router.post('/users/register', createNew)
router.put('/users/verify', verifyAccount)
router.get('/users/:id', getUserById)
router.put('/users/:userId/update-profile', updateUser)
router.put('/users/:id/change-password', changePassword)

router.get('/:id/get_2fa_qr_code', get2FAQrCode);
router.put('/:id/verify_2fa', verify2FA);
router.post('/:id/setup_2fa', setup2FA);

module.exports = router