import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [savings, setSavings] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]);
    const [error, setError] = useState(null);

    // --- Tiết kiệm ---
    const getSavings = useCallback( async () => {
        try {
            const response = await axios.get(`${BASE_URL}savings`);
            console.log("Savings data received:", response.data)
            setSavings(response.data);
        } catch (err) {
            console.error('Error fetching savings:', err);
        }
    }, []);

    const addSaving = async (saving) => {
        try {
            if (!saving.goal || !saving.targetAmount) {
                setError('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            const response = await axios.post(`${BASE_URL}savings`, saving);
            setSavings((prevSavings) => [...prevSavings, response.data]);
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding saving');
        }
    };
    

    const deleteSaving = async (id) => {
        try {
            await axios.delete(`${BASE_URL}savings/${id}`);
            getSavings()
        } catch (err) {
            console.error('Error deleting saving:', err);
        }
    };

    const updateSavingProgress = async (id, newAmount) => {
        try {
            await axios.put(`${BASE_URL}savings/${id}`, { currentAmount: newAmount });
            // Lấy lại danh sách tiết kiệm sau khi cập nhật
            getSavings();
        } catch (err) {
            console.error('Error updating saving progress:', err);
        }
    }


    // --- Khoản nợ ---
    const getDebts = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-debts`);
            setDebts(response.data);
        } catch (err) {
            console.error('Error fetching debts:', err);
        }
    }, []);

    const addDebt = async (debt) => {
        try {
            await axios.post(`${BASE_URL}add-debt`, debt);
            getDebts();
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding debt');
        }
    };

    const deleteDebt = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-debt/${id}`);
            getDebts();
        } catch (err) {
            console.error('Error deleting debt:', err);
        }
    };

    const totalDebts = () => {
        return debts.reduce((acc, debt) => acc + debt.amount, 0);
    };

    // --- Khoản thu nhập ---
    const getIncomes = useCallback( async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            console.error('Error fetching incomes:', err);
        }
    }, []);

    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding income');
        }
    };

    // Xóa thu nhập
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            console.error('Error deleting income:', err);
        }
    };

    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // --- Khoản chi tiêu ---
    const getExpenses = useCallback( async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
        }
    }, []);

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense');
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    const totalExpenses = () => {
        // Tính tổng chi tiêu từ danh sách expenses
        const totalExpensesAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    
        // Tính tổng số tiền đã được cập nhật trong các mục tiêu tiết kiệm
        const totalSavingsProgress = savings.reduce((acc, saving) => acc + saving.currentAmount, 0);
    
        // Tổng chi tiêu bao gồm cả tiền cập nhật tiến độ của mục tiêu tiết kiệm
        return totalExpensesAmount + totalSavingsProgress;
    };

    // --- Tổng hợp ---
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        // Hợp nhất danh sách giao dịch với tên tiếng Việt
        const history = [
            ...incomes.map((income) => ({ ...income, type: 'Thu nhập' })),
            ...expenses.map((expense) => ({ ...expense, type: 'Chi tiêu' })),
            ...debts.map((debt) => ({ ...debt, type: 'Vay, Nợ' })),
            ...savings.map((saving) => ({
                ...saving,
                type: 'Mục tiêu',
                createdAt: saving.updatedAt || saving.createdAt, // Sử dụng updatedAt nếu có
            })),
        ];
    
        // Sắp xếp giao dịch theo ngày mới nhất
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    const savingsProgress = () => {
        const totalCurrent = savings.reduce((acc, saving) => acc + saving.currentAmount, 0);
        const totalTarget = savings.reduce((acc, saving) => acc + saving.targetAmount, 0);
        return { totalCurrent, totalTarget };
    };

    // --- Lấy dữ liệu khi khởi chạy ---
    useEffect(() => {
        getSavings();
        getDebts();
        getIncomes();
        getExpenses();
    }, [getSavings, getDebts, getIncomes, getExpenses]);

    return (
        <GlobalContext.Provider
            value={{
                // Tiết kiệm
                savings,
                getSavings,
                addSaving,
                deleteSaving,
                updateSavingProgress,
                // Nợ
                debts,
                addDebt,
                getDebts,
                deleteDebt,
                totalDebts,
                // Thu nhập
                incomes,
                addIncome,
                getIncomes,
                deleteIncome,
                totalIncome,
                // Chi tiêu
                expenses,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                // Tổng hợp
                totalBalance,
                transactionHistory,
                savingsProgress,
                // Lỗi
                error,
                setError,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
