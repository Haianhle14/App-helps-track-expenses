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

    input {
        padding: 0.8rem;
        width: 100%;
        max-width: 500px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
    }

    button {
        padding: 0.8rem 1.5rem;
        margin-bottom: 1.5rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;

        &:hover {
            background: linear-gradient(to right, #6dd5ed, #2193b0);
        }
    }
`

export default SavingGoalForm
