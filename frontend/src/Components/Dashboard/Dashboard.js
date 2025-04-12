import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import PieChart from '../Chart/PieChart';
import SavingsPieChart from '../Chart/SavingsPieChart';
import Require2FA from '../../pages/Auth/require-2fa'; // ✅ Thêm dòng này

function Dashboard() {
    const {
        user, is2FAVerified, setIs2FAVerified, // ✅ Thêm 3 biến này từ context
        totalExpenses, incomes, expenses, totalIncome, totalBalance, debts,
        getIncomes, getExpenses, getDebts, savingsProgress
    } = useGlobalContext();

    const [showExpensesList, setShowExpensesList] = useState(false);

    useEffect(() => {
        getIncomes();
        getExpenses();
        getDebts();
    }, [getIncomes, getExpenses, getDebts]);

    // ✅ Nếu cần xác thực 2FA, hiển thị giao diện nhập mã và return luôn
    if (user?.require_2fa && !is2FAVerified) {
        return (
            <Require2FA
                user={user}
                handleSuccessVerify2FA={(updatedUser) => {
                    setIs2FAVerified(true);
                    // Nếu cần cập nhật user trong context, bạn có thể set lại ở đây
                }}
            />
        );
    }

    const totalLoaned = debts.filter(debt => debt.type === 'lend').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBorrowed = debts.filter(debt => debt.type === 'borrow').reduce((acc, curr) => acc + curr.amount, 0);
    const { totalCurrent, totalTarget } = savingsProgress();
    const totalSavingsProgress = totalCurrent;

    const toggleExpensesList = () => {
        setShowExpensesList(!showExpensesList);
    };

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>Tất Cả Các Giao Dịch</h1>
                <div className="dashboard-content">
                    <div className="stats-con">
                        <div className="chart-con">
                            <Chart />
                            <div className="amount-con">
                                <div className="income">
                                    <h2>Tổng thu nhập</h2>
                                    <p>{totalIncome()}đ</p>
                                </div>
                                <div className="expense" onClick={toggleExpensesList}>
                                    <h2>Tổng chi tiêu</h2>
                                    <p>{totalExpenses()}đ</p>
                                    {showExpensesList && (
                                        <div className="expenses-list">
                                            <h3>Danh sách chi tiêu</h3>
                                            <ul>
                                                {expenses.map((expense, index) => (
                                                    <li key={index}>
                                                        {expense.title}: {expense.amount}đ
                                                    </li>
                                                ))}
                                                <li>
                                                    <strong>Tiền tiết kiệm:</strong> {totalSavingsProgress}đ
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="balance">
                                    <h2>Tổng số dư</h2>
                                    <p>{totalBalance()}đ</p>
                                </div>
                            </div>
                        </div>
                        <div className="history-con">
                            <History />
                            <h2 className="salary-title">Min <span>Thu nhập</span> Max</h2>
                            <div className="salary-item">
                                <p>{Math.min(...incomes.map(item => item.amount))}đ</p>
                                <p>{Math.max(...incomes.map(item => item.amount))}đ</p>
                            </div>
                            <h2 className="salary-title">Min <span>Chi tiêu</span> Max</h2>
                            <div className="salary-item">
                                <p>{Math.min(...expenses.map(item => item.amount))}đ</p>
                                <p>{Math.max(...expenses.map(item => item.amount))}đ</p>
                            </div>
                        </div>
                        <div className="pie-chart-con">
                            <div className="pie-chart-item">
                                <PieChart totalLoaned={totalLoaned} totalBorrowed={totalBorrowed} />
                            </div>
                            <div className="savings-pie-chart-item">
                                <SavingsPieChart totalCurrent={totalCurrent} totalTarget={totalTarget} />
                            </div>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .dashboard-content {
        overflow-y: auto;
        height: calc(100vh - 80px);
        padding-right: 5px;

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }

    .stats-con {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        padding-bottom: 2rem;

        @media (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 1200px) {
            grid-template-columns: repeat(3, 1fr);
        }

        .chart-con {
            grid-column: span 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;

            .amount-con {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 1rem;
                margin-top: 2rem;

                .income, .expense, .balance {
                    flex: 1 1 calc(33.333% - 1rem);
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;
                    text-align: center;
                    cursor: pointer;

                    h2 {
                        font-size: 1.5rem;
                        margin-bottom: 0.5rem;
                    }

                    p {
                        font-size: 2rem;
                        font-weight: 700;
                    }
                }

                .balance {
                    color: var(--color-green);
                }
            }
        }

        .history-con {
            grid-column: span 1;

            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .salary-title {
                font-size: 1.2rem;
                margin: 1rem 0;

                span {
                    font-size: 1.8rem;
                }
            }

            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                p {
                    font-weight: 600;
                    font-size: 1.4rem;
                }
            }
        }

        .pie-chart-con {
            grid-column: span 3;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            background: #ffffff;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
            margin-top: 2rem;

            .pie-chart-item {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50%;
            }

            .savings-pie-chart-item {
                width: 34%;
            }

            @media (max-width: 768px) {
                flex-direction: column;

                .pie-chart-item,
                .savings-pie-chart-item {
                    width: 100%;
                }
            }
        }
    }

    .expenses-list {
        margin-top: 1rem;
        padding: 1rem;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        max-height: 300px;
        overflow-y: auto;
    }

    .expenses-list h3 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }

    .expenses-list ul {
        list-style-type: none;
        padding: 0;
    }

    .expenses-list ul li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .expenses-list ul li:last-child {
        border-bottom: none;
    }
`;

export default Dashboard;
