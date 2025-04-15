import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses() {
    const {expenses, getExpenses, deleteExpense, totalExpenses} = useGlobalContext()

    useEffect(() =>{
        getExpenses()
    }, [getExpenses])
    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Quản Lý Chi Tiêu</h1>
                <h2 className="total-income">Tổng chi tiêu: <span>{totalExpenses()}đ</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    <div className="incomes">
                        {expenses.map((income) => {
                            const {_id, title, amount, date, category, description, type} = income;
                            return <IncomeItem
                                key={_id}
                                id={_id} 
                                title={title} 
                                description={description} 
                                amount={amount} 
                                date={date} 
                                type={type}
                                category={category} 
                                indicatorColor="var(--color-green)"
                                deleteItem={deleteExpense}
                            />
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    )
}

const ExpenseStyled = styled.div`
    width: 100%;
    overflow-x: hidden;

    h1 {
        font-size: 2.5rem;
        text-align: center;

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: 0.5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;

        .form-container {
            flex: 1;
            min-width: 280px;
        }

        .incomes {
            flex: 2;
            min-width: 0;
        }
    }
`;


export default Expenses