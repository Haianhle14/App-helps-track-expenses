import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';

import DebtItem from '../DebtItem/DebtItem';
import DebtForm from './DebtForm';

function Debts() {
    const { debts, getDebts, deleteDebt, totalDebts } = useGlobalContext();

    useEffect(() => {
        getDebts();
    }, [getDebts]);

    const { totalBorrowDebt, totalLendDebt } = totalDebts();  // Gọi hàm totalDebts và lấy tổng nợ vay và cho vay

    return (
        <DebtStyled>
            <InnerLayout>
                <h1>Quản Lý Vay Và Cho Vay</h1>

                <div className="total-debt">
                    <div className="debt-card">
                        <h2>
                            Tổng nợ bạn phải trả: <span>{totalBorrowDebt.toLocaleString('vi-VN')}đ</span>
                        </h2>
                    </div>
                    <div className="debt-card">
                        <h2>
                            Tổng tiền bạn đã cho vay: <span>{totalLendDebt.toLocaleString('vi-VN')}đ</span>
                        </h2>
                    </div>
                </div>

                <div className="debt-content">
                    <div className="form-container">
                        <DebtForm />
                    </div>
                    <div className="debts">
                        {debts.map((debt) => {
                            const { _id, type, amount, borrower, lender, dueDate, description } = debt;
                            return (
                                <DebtItem
                                    key={_id}
                                    id={_id}
                                    type={type}
                                    amount={amount}
                                    borrower={borrower}
                                    lender={lender}
                                    dueDate={dueDate}
                                    description={description}
                                    deleteItem={deleteDebt}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </DebtStyled>
    );
}

const DebtStyled = styled.div`
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;

    .total-debt {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        margin-bottom: 2rem;

        .debt-card {
            flex: 1;
            background: #ffffff;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;

            h2 {
                margin: 0;
                font-size: 1.8rem;
                color: #333;
            }

            span {
                font-size: 2.5rem;
                font-weight: 700;
                color: #4caf50;
            }

            &:first-child {
                background: #f3f9f7;
            }

            &:last-child {
                background: #fff8e1;
            }
        }
    }

    .debt-content {
        display: flex;
        gap: 2rem;
        justify-content: space-between;

        .form-container {
            flex: 0.3;
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        }

        .debts {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }
`;

export default Debts;
