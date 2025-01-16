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

    return (
        <DebtStyled>
            <InnerLayout>
                <h1>Quản lý nợ</h1>
                <h2 className="total-debt">
                    Tổng số tiền nợ: <span>{totalDebts()}đ</span>
                </h2>
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
    display: flex;
    overflow: auto;
    .total-debt {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: 0.5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .debt-content {
        display: flex;
        gap: 2rem;
        .debts {
            flex: 1;
        }
    }
`;

export default Debts;
