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
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [twoFactorQR, setTwoFactorQR] = useState(null);
    const [is2FAVerified, setIs2FAVerified] = useState(false);

    const userId = localStorage.getItem('userId')

    const resetAllData = useCallback(() => {
        setSavings([])
        setIncomes([])
        setExpenses([])
        setDebts([])
        setError(null)
    }, [])


    // --- 2FA ---
    const get2FAQrCode = async (userId) => {
        if (!userId) {
          console.warn('userId không tồn tại khi gọi get2FAQrCode');
          return;
        }
      
        try {
          const { data } = await axios.get(`${BASE_URL}${userId}/get_2fa_qr_code`);
          setTwoFactorQR(data.qrCode);
          return data;
        } catch (err) {
          console.error('Lỗi khi lấy mã QR:', err.response?.data || err);
          throw new Error(err.response?.data?.message || 'Lỗi khi lấy mã QR');
        }
    };
      
    const setup2FA = async (userId, otpToken, userAgent) => {
        try {
          const { data } = await axios.post(`${BASE_URL}${userId}/setup_2fa`, {
            otpToken,
            userAgent
          });
          return data;
        } catch (err) {
          console.error('Lỗi khi thiết lập 2FA:', err.response?.data || err);
          throw new Error(err.response?.data?.message || 'Thiết lập 2FA thất bại');
        }
    };
    
    
    // Kiểm tra trạng thái 2FA và xác thực khi người dùng đã login
    const verify2FA = async (userId, otpToken) => {
        if (!userId || !otpToken) return;
    
        try {
        const { data } = await axios.put(`${BASE_URL}${userId}/verify_2fa`, { userId, otpToken });
    
        // Lưu token mới vào localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data);
    
        // Lưu trạng thái 2FA đã xác minh
        localStorage.setItem('is2FAVerified', true)
    
        setIs2FAVerified(true);
        return data;
        } catch (err) {
        console.error('Lỗi khi xác thực 2FA:', err.response?.data || err);
        throw new Error(err.response?.data?.message || 'Xác thực 2FA thất bại');
        }
    };
    async function disable2FA(userId) {
        try {
            const response = await fetch(`${BASE_URL}${userId}/disable-2fa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            if (data.success) {
                alert('2FA đã được vô hiệu hóa');
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            alert('Lỗi kết nối: ' + error.message);
        }
    }
      
            
    
    const check2FAStatus = () => {
        const is2FAVerified = localStorage.getItem('is2FAVerified');
        if (is2FAVerified === 'true') {
        setIs2FAVerified(true);
        } else {
        setIs2FAVerified(false);
        }
    };
    
    useEffect(() => {
        check2FAStatus();
    }, []);
  


    // --- USER ---
    const getUser = useCallback(async () => {
        if (!userId) {
            resetAllData();
            return;
        }
        try {
            const { data } = await axios.get(`${BASE_URL}users/${userId}`, {
                params: { _: new Date().getTime() }
            });
            setUser(data);
            if (data?.displayName) {
                localStorage.setItem('displayName', data.displayName);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            setUser(null);
            resetAllData();
        }
    }, [userId, resetAllData]);
    
    const updateUser = async (updates) => {
        if (!user?._id) throw new Error('Không tìm thấy user ID');
    
        try {
            const { data: updatedUser } = await axios.put(
                `${BASE_URL}users/${user._id}/update-profile`,
                { updateData: updates }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
    
            return updatedUser; 
        } catch (err) {
            console.error('Lỗi khi cập nhật người dùng:', err.response?.data || err);
            throw new Error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin');
        }
    };
    
    const changePassword = async (oldPassword, newPassword) => {
        if (!userId) throw new Error('Không tìm thấy user ID');
        try {
            const { data } = await axios.put(`${BASE_URL}users/${userId}/change-password`, {
                oldPassword,
                newPassword,
            });
            return data.message;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Lỗi khi đổi mật khẩu');
        }
    };

    const verifyUserAPI = async ({ email, token }) => {
        try {
          const response = await axios.put(`${BASE_URL}users/verify`, { email, token })
          setUser(response.data.user)
          return response.data
        } catch (error) {
          throw new Error('Xác minh tài khoản thất bại')
        }
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
        if (!id) {
          console.error('Không có ID để xoá!');
          return;
        }
      
        try {
          await axios.delete(`${BASE_URL}savings/${id}`);
          getSavings();
        } catch (err) {
          console.error('Error deleting saving:', err.response?.data || err.message);
        }
      };
    

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
            const userId = localStorage.getItem("userId")
            await axios.delete(`${BASE_URL}delete-debt/${id}?userId=${userId}`)
            getDebts()
        } catch (err) {
            console.error('Error deleting debt:', err)
        }
    }
    

    const totalDebts = () => {
        // Tính tổng số nợ mà người dùng phải trả (nợ vay)
        const totalBorrowDebt = debts
            .filter(debt => debt.type === 'borrow')  // Lọc ra nợ vay
            .reduce((acc, debt) => acc + debt.amount, 0);
    
        // Tính tổng số tiền mà người dùng đã cho vay (nợ cho vay)
        const totalLendDebt = debts
            .filter(debt => debt.type === 'lend')  // Lọc ra nợ cho vay
            .reduce((acc, debt) => acc + debt.amount, 0);
    
        // Trả về cả tổng nợ vay và tổng tiền cho vay
        return {
            totalBorrowDebt,  // Tổng nợ vay (số tiền bạn phải trả)
            totalLendDebt,    // Tổng nợ cho vay (số tiền bạn đã cho vay)
        };
    };
    
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
    
    // --- TỔNG HỢP ---
    const getMonthlySummary = () => {
        const summary = {};
      
        // Kiểm tra xem các mảng dữ liệu có hợp lệ hay không
        if (!Array.isArray(incomes) || !Array.isArray(expenses) || !Array.isArray(savings) || !Array.isArray(debts)) {
          return summary; // Trả về một đối tượng rỗng nếu không có dữ liệu hợp lệ
        }
      
        // Xử lý dữ liệu từ incomes
        incomes.forEach(income => {
          const month = new Date(income?.date).toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!month) return; // Nếu tháng không hợp lệ, bỏ qua
          if (!summary[month]) summary[month] = { income: 0, expense: 0, saving: 0, lend: 0, borrow: 0 };
          summary[month].income += income?.amount || 0; // Sử dụng giá trị mặc định 0 nếu amount là undefined
        });
      
        // Xử lý dữ liệu từ expenses
        expenses.forEach(expense => {
          const month = new Date(expense?.date).toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!month) return; // Nếu tháng không hợp lệ, bỏ qua
          if (!summary[month]) summary[month] = { income: 0, expense: 0, saving: 0, lend: 0, borrow: 0 };
          summary[month].expense += expense?.amount || 0; // Sử dụng giá trị mặc định 0 nếu amount là undefined
        });
      
      
        // Xử lý dữ liệu từ debts
        debts.forEach(debt => {
          const month = new Date(debt?.dueDate).toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!month) return; // Nếu tháng không hợp lệ, bỏ qua
          if (!summary[month]) summary[month] = { income: 0, expense: 0, saving: 0, lend: 0, borrow: 0 };
      
          // Cập nhật số tiền cho vay hoặc nợ vay
          if (debt.type === 'lend') {
            summary[month].lend += debt?.amount || 0; // Dùng 0 nếu amount không hợp lệ
          } else if (debt.type === 'borrow') {
            summary[month].borrow += debt?.amount || 0; // Dùng 0 nếu amount không hợp lệ
          }
        });
      
        return summary;
      };
      
      

    const totalExpenses = () => {
        const expenseSum = expenses.reduce((acc, expense) => acc + expense.amount, 0)
        const savingSpent = savings.reduce((acc, saving) => acc + saving.currentAmount, 0)
        return expenseSum + savingSpent
    }

    const totalBalance = () => totalIncome() - totalExpenses()

    const transactionHistory = () => {
        const history = [
            ...incomes.map(i => ({ ...i, type: 'Thu nhập' })),
            ...expenses.map(e => ({ ...e, type: 'Chi tiêu' })),
            ...debts.map(d => ({ 
                ...d, 
                type: d.type === 'lend' ? 'Cho vay' : d.type === 'borrow' ? 'Vay' : 'Vay, cho vay',
                title: d.type === 'lend' ? 'Cho vay' : d.type === 'borrow' ? 'Vay' : d.type
            })),
            ...savings.map(s => ({ ...s, type: 'Mục tiêu', title: s.goal, createdAt: s.updatedAt || s.createdAt })),
        ]
        return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    }

    const getUpcomingDebtsReminder = (daysBefore = 7) => {
        if (!Array.isArray(debts)) return [];
    
        const today = new Date();
        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + daysBefore);
    
        return debts.filter(debt => {
            const due = new Date(debt.dueDate);
            return due >= today && due <= reminderDate;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    };
    
    
    const savingsProgress = () => {
        const totalCurrent = savings.reduce((acc, s) => acc + s.currentAmount, 0)
        const totalTarget = savings.reduce((acc, s) => acc + s.targetAmount, 0)
        return { totalCurrent, totalTarget }
    }

    const login = async (credentials) => {
        try {
            const { data } = await axios.post(`${BASE_URL}users/login`, credentials)
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            setToken(data.token)
            getUser()
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        window.location.href = "/login"
    }

    useEffect(() => {
        if (token) {
            getUser();
            getSavings();
            getDebts();
            getIncomes();
            getExpenses();
        }
    }, [token, getUser, getSavings, getDebts, getIncomes, getExpenses])

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
                user, getUser, updateUser, verifyUserAPI, changePassword, login, logout,
                savings, getSavings, addSaving, deleteSaving, updateSavingProgress,
                debts, getDebts, addDebt, deleteDebt, totalDebts,
                incomes, getIncomes, addIncome, deleteIncome, totalIncome,
                expenses, getExpenses, addExpense, deleteExpense, totalExpenses,
                totalBalance, transactionHistory, getMonthlySummary, savingsProgress,
                error, setError,
                get2FAQrCode, setup2FA, verify2FA, twoFactorQR, is2FAVerified, setIs2FAVerified, disable2FA,
                getUpcomingDebtsReminder
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
