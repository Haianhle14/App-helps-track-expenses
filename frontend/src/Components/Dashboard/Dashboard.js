import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import PieChart from '../Chart/PieChart';
import SavingsPieChart from '../Chart/SavingsPieChart';

function Dashboard() {
    const {
        totalExpenses, incomes, expenses, totalIncome, totalBalance, debts, getIncomes, getExpenses, getDebts, savingsProgress
    } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
        getDebts();
    }, [getIncomes, getExpenses, getDebts]);

    const totalLoaned = debts.filter(debt => debt.type === 'lend').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBorrowed = debts.filter(debt => debt.type === 'borrow').reduce((acc, curr) => acc + curr.amount, 0);
    const { totalCurrent, totalTarget } = savingsProgress();

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>Tất Cả Các Giao Dịch</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Tổng thu nhập</h2>
                                <p>{totalIncome()}đ</p>
                            </div>
                            <div className="expense">
                                <h2>Tổng chi tiêu</h2>
                                <p>{totalExpenses()}đ</p>
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
                        <PieChart totalLoaned={totalLoaned} totalBorrowed={totalBorrowed} />
                        <SavingsPieChart totalCurrent={totalCurrent} totalTarget={totalTarget} />
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

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
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            text-align: center;
            gap: 2rem;

            canvas {
                max-width: 400px;
                width: 40%;
            }

            .savings-chart {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

                width: 40%;
                max-width: 400px;
                text-align: center;

                h2 {
                    color: var(--color-primary);
                }
            }
        }
    }
`;


export default Dashboard;
