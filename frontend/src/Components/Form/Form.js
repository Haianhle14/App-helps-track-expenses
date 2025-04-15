import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useGlobalContext } from '../../context/globalContext'
import Button from '../Button/Button'
import { plus } from '../../utils/Icons'
import { toast } from 'react-toastify'

function Form() {
    const { addIncome, error, setError } = useGlobalContext()
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    })

    const { title, amount, date, category, description } = inputState

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value })
        setError('')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await addIncome(inputState)
            toast.success('Thêm thu nhập thành công!')
            setInputState({
                title: '',
                amount: '',
                date: '',
                category: '',
                description: '',
            })
        } catch (err) {
            toast.error('Lỗi khi thêm thu nhập')
        }
    }

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Chức danh"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input 
                    value={amount}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Mức lương'}
                    onChange={handleInput('amount')} 
                />
            </div>
            <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Nhập ngày'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({ ...inputState, date: date })
                    }}
                />
            </div>
            <div className="selects input-control">
                <select required value={category} name="category" id="category" onChange={handleInput('category')}>
                    <option value="" disabled>Chọn tùy chọn</option>
                    <option value="salary">Lương</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Đầu tư</option>
                    <option value="stocks">Cổ phiếu</option>
                    <option value="bitcoin">Tiền điện tử</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>  
                    <option value="youtube">Youtube</option>  
                    <option value="other">Khác</option>  
                </select>
            </div>
            <div className="input-control">
                <textarea 
                    name="description" 
                    value={description} 
                    placeholder='Thêm mô tả' 
                    id="description" 
                    cols="30" 
                    rows="4" 
                    onChange={handleInput('description')}
                />
            </div>
            <div className="submit-btn">
                <Button 
                    name={'Thêm thu nhập'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </FormStyled>
    )
}
const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;

    .error {
        color: red;
        font-size: 0.9rem;
        margin-top: -1rem;
        margin-bottom: -0.5rem;
    }

    input, textarea, select {
        font-family: inherit;
        font-size: 1rem;
        width: 100%;
        outline: none;
        border: none;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        border: 2px solid #fff;
        background: #fff;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        word-break: break-word;
        overflow-wrap: break-word;

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        width: 100%;

        input, textarea {
            width: 100%;
        }

        textarea {
            min-height: 80px;
        }

        .react-datepicker-wrapper {
            width: 100%;
            input {
                width: 100%;
            }
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;
        select {
            width: 100%;
            background: #fff;
            color: rgba(34, 34, 96, 0.6);
            &:focus,
            &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn {
        display: flex;
        justify-content: flex-end;

        button {
            white-space: nowrap;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: linear-gradient(to right, #6dd5ed, #2193b0) !important;
            }
        }
    }

    // Responsive tweaks
    @media (max-width: 600px) {
        gap: 1rem;

        input,
        textarea,
        select {
            font-size: 0.95rem;
            padding: 0.5rem 0.8rem;
        }

        .submit-btn {
            justify-content: center;
        }
    }
`;

export default Form
