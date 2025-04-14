import React, { useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'

function SavingGoalForm({ onAdd }) {
    const [savingGoal, setSavingGoal] = useState('')
    const [amount, setAmount] = useState('')

    const handleAddSaving = (e) => {
        e.preventDefault()

        if (!savingGoal.trim() || !amount.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin.')
            return
        }

        const amountValue = parseFloat(amount)

        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error('Số tiền mục tiêu phải là một số lớn hơn 0.')
            return
        }

        onAdd({ goal: savingGoal.trim(), targetAmount: amountValue, currentAmount: 0 })
        toast.success('Đã thêm mục tiêu tiết kiệm!')

        setSavingGoal('')
        setAmount('')
    }

    return (
        <FormStyled onSubmit={handleAddSaving}>
            <input
                type="text"
                placeholder="Tên mục tiêu"
                value={savingGoal}
                onChange={(e) => setSavingGoal(e.target.value)}
            />
            <input
                type="number"
                placeholder="Số tiền mục tiêu"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit">Thêm mục tiêu</button>
        </FormStyled>
    )
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    input {
        padding: 1rem;
        width: 100%;
        max-width: 500px;
        border: 1px solid #ddd;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0px 2px 8px rgba(0,0,0,0.05);

        &:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px rgba(109, 213, 237, 0.3);
        }
    }

    button {
        padding: 0.9rem 2rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);

        &:hover {
            background: linear-gradient(to right, #6dd5ed, #2193b0);
            transform: translateY(-2px);
        }
    }
`;

export default SavingGoalForm
