import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useGlobalContext } from '../../context/globalContext'
import Button from '../Button/Button'
import { plus } from '../../utils/Icons'
import { toast } from 'react-toastify'

function DebtForm() {
    const { addDebt, error, setError } = useGlobalContext()

    const [inputState, setInputState] = useState({
        type: '',
        amount: '',
        borrower: '',
        lender: '',
        dueDate: '',
        description: '',
    })

    const { type, amount, borrower, lender, dueDate, description } = inputState

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!type) {
            toast.error('Vui lòng chọn loại giao dịch.')
            return
        }

        const amountValue = parseFloat(amount)
        if (!amount || isNaN(amountValue) || amountValue <= 0) {
            toast.error('Số tiền phải là số lớn hơn 0.')
            return
        }

        if (!dueDate) {
            toast.error('Vui lòng chọn ngày đến hạn.')
            return
        }

        // Với type "borrow" -> bạn vay tiền từ người khác nên cần nhập tên của người cho vay (lender)
        if (type === 'borrow' && !lender) {
            toast.error('Vui lòng nhập tên người cho vay.')
            return
        }

        // Với type "lend" -> bạn cho người khác vay tiền nên cần nhập tên của người vay (borrower)
        if (type === 'lend' && !borrower) {
            toast.error('Vui lòng nhập tên người vay.')
            return
        }

        const data = {
            type,
            amount: amountValue,
            borrower,
            lender,
            dueDate,
            description,
        }

        addDebt(data)
        toast.success(
            type === 'borrow'
                ? 'Đã thêm khoản vay (bạn vay từ người khác).'
                : 'Đã thêm khoản cho vay (bạn cho người khác vay).'
        )

        setInputState({
            type: '',
            amount: '',
            borrower: '',
            lender: '',
            dueDate: '',
            description: '',
        })
    }

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <div className="input-control">
                <select required value={type} name="type" onChange={handleInput('type')}>
                    <option value="" disabled>Chọn tùy chọn</option>
                    <option value="borrow">Vay (bạn vay từ người khác)</option>
                    <option value="lend">Cho vay (bạn cho người khác vay)</option>
                </select>
            </div>

            <div className="input-control">
                <input
                    type="number"
                    value={amount}
                    name="amount"
                    placeholder="Số tiền"
                    onChange={handleInput('amount')}
                />
            </div>

            {type && (
                <div className="input-control">
                    {type === 'borrow' && (
                        <input
                            type="text"
                            value={lender}
                            name="lender"
                            placeholder="Người cho vay"
                            onChange={handleInput('lender')}
                        />
                    )}
                    {type === 'lend' && (
                        <input
                            type="text"
                            value={borrower}
                            name="borrower"
                            placeholder="Người vay"
                            onChange={handleInput('borrower')}
                        />
                    )}
                </div>
            )}

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
                />
            </div>

            <div className="submit-btn">
                <Button
                    name={'Thêm khoản vay/ cho vay'}
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

    input, textarea, select {
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

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: linear-gradient(to right, #6dd5ed, #2193b0)!important;
            }
        }
    }
`

export default DebtForm
