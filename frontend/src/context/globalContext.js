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

    // Reset all data when userId changes
    const resetAllData = useCallback(() => {
        setSavings([])
        setIncomes([])
        setExpenses([])
        setDebts([])
        setError(null)
    }, [])

    // --- USER ---
    const getUser = useCallback(async () => {
        if (!userId) {
            resetAllData()
            return
        }
        try {
            const { data } = await axios.get(`${BASE_URL}users/${userId}`, {
                params: { _: new Date().getTime() } // Cache buster
            })
            setUser(data)
            if (data?.displayName) {
                localStorage.setItem('displayName', data.displayName)
            }
        } catch (err) {
            console.error('Error fetching user:', err)
            setUser(null)
            resetAllData()
        }
    }, [userId, resetAllData])

    const updateUser = async (updateData) => {
        if (!user?._id) throw new Error('Không tìm thấy user ID')
        const res = await axios.put(`${BASE_URL}users/${userId}/update-profile`, { updateData })
        
        const updatedUser = res.data
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }
      
    const changePassword = async (oldPassword, newPassword) => {
        if (!userId) throw new Error('Không tìm thấy user ID')
    
        try {
            const { data } = await axios.put(`${BASE_URL}users/${userId}/change-password`, {
                oldPassword,
                newPassword,
            })
    
            return data.message
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Lỗi khi đổi mật khẩu')
        }
    }
    

    const logout = () => {
        setUser(null)
        resetAllData()
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('displayName')
        localStorage.removeItem('user')
    }
    

    // --- SAVINGS ---
    const getSavings = useCallback(async () => {
        if (!userId) {
            setSavings([]);
            return;
        }
    
        try {
            const { data } = await axios.get(`${BASE_URL}savings`, { 
                params: { userId }
            });
    
            if (Array.isArray(data)) {
                setSavings(data); // Không cần lọc lại theo userId nếu API đã xử lý
            } else {
                setSavings([]);
                setError("Dữ liệu trả về không hợp lệ");
            }
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu tiết kiệm:", err);
            setSavings([]);
            setError("Lỗi khi tải dữ liệu tiết kiệm: " + err.message);
        }
    }, [userId]);
    
    

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
        if (!id) {
          console.error('Không có ID để xoá!')
          return
        }
      
        try {
          await axios.delete(`${BASE_URL}savings/${id}`)
          getSavings()
        } catch (err) {
          console.error('Error deleting saving:', err.response?.data || err.message)
        }
    }
    

    const updateSavingProgress = async (id, newAmount) => {
        const parsedAmount = Number(newAmount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Số tiền không hợp lệ!');
            return;
        }
    
        // Lưu lại dữ liệu cũ để rollback nếu có lỗi
        const previousSavings = [...savings];
    
        // Cập nhật UI ngay lập tức bằng cách tạo một bản sao mới của danh sách
        setSavings(prevSavings =>
            prevSavings.map(saving =>
                saving._id === id
                    ? { ...saving, currentAmount: parsedAmount, updatedAt: new Date().toISOString() }
                    : saving
            )
        );
    
        try {
            // Gọi API để cập nhật trên server
            await axios.put(`${BASE_URL}savings/${id}`, {
                currentAmount: parsedAmount,
                userId,
            });
    
            // Không cần gọi `getSavings()` vì UI đã cập nhật ngay lập tức
        } catch (err) {
            console.error('Lỗi khi cập nhật tiến trình tiết kiệm:', err);
    
            // Nếu thất bại, khôi phục dữ liệu cũ (Rollback)
            setSavings(previousSavings);
    
            setError('Cập nhật không thành công: ' + (err.response?.data?.message || err.message));
        }
    };
    
    

    // --- DEBTS ---
    const getDebts = useCallback(async () => {
        if (!userId) {
            setDebts([])
            return
        }
        try {
            const { data } = await axios.get(`${BASE_URL}get-debts`, { 
                params: { 
                    userId,
                    _: new Date().getTime() 
                } 
            })
            if (data.every(item => item.userId === userId)) {
                setDebts(data)
            } else {
                setDebts([])
                setError('Dữ liệu không khớp với người dùng hiện tại')
            }
        } catch (err) {
            console.error('Error fetching debts:', err)
            setDebts([])
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
            const userId = localStorage.getItem("userId")
            await axios.delete(`${BASE_URL}delete-debt/${id}?userId=${userId}`)
            getDebts()
        } catch (err) {
            console.error('Error deleting debt:', err)
        }
    }
    

    const totalDebts = () => debts.reduce((acc, debt) => acc + debt.amount, 0)

    // --- INCOMES ---
    const getIncomes = useCallback(async () => {
        if (!userId) {
            setIncomes([])
            return
        }
        try {
            const { data } = await axios.get(`${BASE_URL}get-incomes`, {
                params: { 
                    userId,
                    _: new Date().getTime()
                }
            })
            if (data.every(item => item.userId === userId)) {
                setIncomes(data)
            } else {
                setIncomes([])
                setError('Dữ liệu không khớp với người dùng hiện tại')
            }
        } catch (err) {
            console.error('Error fetching incomes:', err)
            setIncomes([])
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
        if (!userId) {
            setExpenses([])
            return
        }
        try {
            const { data } = await axios.get(`${BASE_URL}get-expenses`, { 
                params: { 
                    userId,
                    _: new Date().getTime()
                } 
            })
            if (data.every(item => item.userId === userId)) {
                setExpenses(data)
            } else {
                setExpenses([])
                setError('Dữ liệu không khớp với người dùng hiện tại')
            }
        } catch (err) {
            console.error('Error fetching expenses:', err)
            setExpenses([])
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


    useEffect(() => {
        resetAllData()
        if (userId) {
            getUser()
            getSavings()
            getDebts()
            getIncomes()
            getExpenses()
        }
    }, [userId, getUser, getSavings, getDebts, getIncomes, getExpenses, resetAllData])

    return (
        <GlobalContext.Provider
            value={{
                user, getUser, updateUser, logout,
                savings, getSavings, addSaving, deleteSaving, updateSavingProgress,
                debts, getDebts, addDebt, deleteDebt, totalDebts,
                incomes, getIncomes, addIncome, deleteIncome, totalIncome,
                expenses, getExpenses, addExpense, deleteExpense, totalExpenses,
                totalBalance, transactionHistory, savingsProgress,
                error, setError,
                changePassword
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)