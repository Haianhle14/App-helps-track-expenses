import React, { useState } from 'react';
import styled from 'styled-components';

function SavingGoalForm({ onAdd }) {
    const [savingGoal, setSavingGoal] = useState('');
    const [amount, setAmount] = useState('');

    const handleAddSaving = () => {
        if (savingGoal && amount) {
            onAdd({ goal: savingGoal, targetAmount: parseFloat(amount), currentAmount: 0 });
            setSavingGoal('');
            setAmount('');
        }
    };

    return (
        <FormStyled>
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
            <button onClick={handleAddSaving}>Thêm mục tiêu</button>
        </FormStyled>
    );
}

const FormStyled = styled.div`
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
        background: var(--color-green);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;

        &:hover {
            background: var(--color-dark-green);
        }
    }
`;

export default SavingGoalForm;
