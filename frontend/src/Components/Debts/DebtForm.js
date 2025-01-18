import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function DebtForm() {
    const { addDebt, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        type: '',
        amount: '',
        borrower: '',
        lender: '',
        dueDate: '',
        description: '',
    });

    const { type, amount, borrower, lender, dueDate, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addDebt(inputState);
        setInputState({
            type: '',
            amount: '',
            borrower: '',
            lender: '',
            dueDate: '',
            description: '',
        });
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="input-control">
                <select
                    required
                    value={type}
                    name="type"
                    onChange={handleInput('type')}
                >
                    <option value="" disabled>
                        Chọn tùy chọn
                    </option>
                    <option value="borrow">Cho Vay</option>
                    <option value="lend">Vay</option>
                </select>
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={amount}
                    name="amount"
                    placeholder="Số tiền"
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={type === 'borrow' ? lender : borrower}
                    name={type === 'borrow' ? 'lender' : 'borrower'}
                    placeholder={
                        type === 'borrow'
                            ? 'Người cho vay'
                            : 'Người vay'
                    }
                    onChange={handleInput(
                        type === 'borrow' ? 'lender' : 'borrower'
                    )}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id="dueDate"
                    placeholderText="Ngày đến hạn"
                    selected={dueDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({ ...inputState, dueDate: date });
                    }}
                />
            </div>
            <div className="input-control">
                <textarea
                    name="description"
                    value={description}
                    placeholder="Thêm mô tả"
                    cols="30"
                    rows="4"
                    onChange={handleInput('description')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name={'Thêm khoản nợ'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input,
    textarea,
    select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .input-control {
        input {
            width: 100%;
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;
        select {
            color: rgba(34, 34, 96, 0.4);
            &:focus,
            &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-green) !important;
            }
        }
    }
`;

export default DebtForm;
