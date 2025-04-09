// ⚠️ Đầu file giữ nguyên như cũ
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/"
const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
    const [savings, setSavings] = useState([])
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [debts, setDebts] = useState([])
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    const userId = localStorage.getItem('userId')

    // --- USER ---
    const getUser = useCallback(async () => {
        if (!userId) return
        try {
            const { data } = await axios.get(`${BASE_URL}users/${userId}`)
            setUser(data)
            if (data?.username) {
                localStorage.setItem('username', data.username)
            }
        } catch (err) {
            console.error('Error fetching user:', err)
            setUser(null)
        }
    }, [userId])

    const updateUser = async (userData) => {
        try {
            const { data } = await axios.put(`${BASE_URL}users/profile`, {
                userId,
                ...userData
            })
            setUser(data)
            return data
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating user')
            throw err
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
    }
    

    // --- SAVINGS ---
    const getSavings = useCallback(async () => {
        if (!userId) return
        try {
            const { data } = await axios.get(`${BASE_URL}savings`, { params: { userId } })
            setSavings(data)
        } catch (err) {
            console.error('Error fetching savings:', err)
        }
    }, [userId])

    const addSaving = async (saving) => {
        if (!saving.goal || !saving.targetAmount) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }
        try {
            const { data } = await axios.post(`${BASE_URL}savings`, {
                ...saving,
                userId,
                amount: Number(saving.amount)
            })
            setSavings(prev => [...prev, data])
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding saving')
        }
    }

    const deleteSaving = async (id) => {
        try {
            await axios.delete(`${BASE_URL}savings/${id}`)
            getSavings()
        } catch (err) {
            console.error('Error deleting saving:', err)
        }
    }

    const updateSavingProgress = async (id, newAmount) => {
        const parsedAmount = Number(newAmount)
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Số tiền không hợp lệ!')
            return
        }
        try {
            await axios.put(`${BASE_URL}savings/${id}`, {
                currentAmount: parsedAmount,
                userId,
            })
            getSavings()
        } catch (err) {
            console.error('Error updating saving progress:', err)
        }
    }

    // --- DEBTS ---
    const getDebts = useCallback(async () => {
        if (!userId) return
        try {
            const { data } = await axios.get(`${BASE_URL}get-debts`, { params: { userId } })
            setDebts(data)
        } catch (err) {
            console.error('Error fetching debts:', err)
        }
    }, [userId])

    const addDebt = async (debt) => {
        try {
            await axios.post(`${BASE_URL}add-debt`, {
                ...debt,
                userId,
                amount: Number(debt.amount)
            })
            getDebts()
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding debt')
        }
    }

    const deleteDebt = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-debt/${id}`)
            getDebts()
        } catch (err) {
            console.error('Error deleting debt:', err)
        }
    }

    const totalDebts = () => debts.reduce((acc, debt) => acc + debt.amount, 0)

    // --- INCOMES ---
    const getIncomes = useCallback(async () => {
        if (!userId) return
        try {
            const { data } = await axios.get(`${BASE_URL}get-incomes`, {
                params: { userId }
            })
            setIncomes(data)
        } catch (err) {
            console.error('Error fetching incomes:', err)
        }
    }, [userId])

    const addIncome = async (income) => {
        if (!userId) {
            setError("Không tìm thấy userId")
            return
        }
        try {
            await axios.post(`${BASE_URL}add-income`, {
                ...income,
                userId,
                amount: Number(income.amount)
            })
            getIncomes()
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding income')
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`)
            getIncomes()
        } catch (err) {
            console.error('Error deleting income:', err)
        }
    }

    const totalIncome = () => incomes.reduce((acc, income) => acc + income.amount, 0)

    // --- EXPENSES ---
    const getExpenses = useCallback(async () => {
        if (!userId) return
        try {
            const { data } = await axios.get(`${BASE_URL}get-expenses`, { params: { userId } })
            setExpenses(data)
        } catch (err) {
            console.error('Error fetching expenses:', err)
        }
    }, [userId])

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, {
                ...expense,
                userId,
                amount: Number(expense.amount)
            })
            getExpenses()
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense')
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, {
                params: { userId }
            })
            getExpenses()
        } catch (err) {
            console.error('Error deleting expense:', err)
        }
    }

    const totalExpenses = () => {
        const expenseSum = expenses.reduce((acc, expense) => acc + expense.amount, 0)
        const savingSpent = savings.reduce((acc, saving) => acc + saving.currentAmount, 0)
        return expenseSum + savingSpent
    }

    // --- TỔNG HỢP ---
    const totalBalance = () => totalIncome() - totalExpenses()

    const transactionHistory = () => {
        const history = [
            ...incomes.map(i => ({ ...i, type: 'Thu nhập' })),
            ...expenses.map(e => ({ ...e, type: 'Chi tiêu' })),
            ...debts.map(d => ({ ...d, type: 'Vay, Nợ' })),
            ...savings.map(s => ({ ...s, type: 'Mục tiêu', createdAt: s.updatedAt || s.createdAt })),
        ]
        return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    }

    const savingsProgress = () => {
        const totalCurrent = savings.reduce((acc, s) => acc + s.currentAmount, 0)
        const totalTarget = savings.reduce((acc, s) => acc + s.targetAmount, 0)
        return { totalCurrent, totalTarget }
    }

    // --- INIT ---
    useEffect(() => {
        if (userId) {
            getUser()
            getSavings()
            getDebts()
            getIncomes()
            getExpenses()
        }
    }, [userId, getUser, getSavings, getDebts, getIncomes, getExpenses])

    return (
        <GlobalContext.Provider
            value={{
                user, getUser, updateUser, logout,
                savings, getSavings, addSaving, deleteSaving, updateSavingProgress,
                debts, getDebts, addDebt, deleteDebt, totalDebts,
                incomes, getIncomes, addIncome, deleteIncome, totalIncome,
                expenses, getExpenses, addExpense, deleteExpense, totalExpenses,
                totalBalance, transactionHistory, savingsProgress,
                error, setError
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
