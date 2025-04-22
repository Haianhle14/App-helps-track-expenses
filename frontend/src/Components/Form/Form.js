import React, { useState, useEffect, useRef } from 'react'
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
    const [customCategories, setCustomCategories] = useState([])
    const [addingCategory, setAddingCategory] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const addCategoryRef = useRef(null)

    const { title, amount, date, category, description } = inputState

    const defaultCategories = {
        salary: "Lương",
        freelancing: "Freelancing",
        investments: "Đầu tư",
        stocks: "Cổ phiếu",
        bitcoin: "Tiền điện tử",
        bank: "Chuyển khoản ngân hàng",
        youtube: "Youtube",
        other: "Khoản thu chưa phân loại"
    }

    const allCategories = {
        ...defaultCategories,
        ...Object.fromEntries(customCategories.map(c => [c.toLowerCase().replace(/\s+/g, '_'), c]))
    }

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value })
        setError('')
    }

    const handleCategoryChange = e => {
        const selected = e.target.value
        if (selected === 'add-new') {
            setAddingCategory(true)
        } else {
            setInputState({
                ...inputState,
                category: selected,
                title: allCategories[selected] || ''
            })
            setAddingCategory(false)
            setNewCategory('')
        }
    }

    const handleAddNewCategory = () => {
        const formattedKey = newCategory.toLowerCase().replace(/\s+/g, '_')
        if (!formattedKey || allCategories[formattedKey]) {
            toast.warn('Nhóm thu nhập đã tồn tại hoặc không hợp lệ')
            return
        }

        setCustomCategories([...customCategories, newCategory])
        setInputState({
            ...inputState,
            category: formattedKey,
            title: newCategory
        })
        setNewCategory('')
        setAddingCategory(false)
    }

    // Ẩn add-category-box khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addCategoryRef.current && !addCategoryRef.current.contains(event.target)) {
                setAddingCategory(false)
                setNewCategory('')
            }
        }
        if (addingCategory) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [addingCategory])

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
            <input type="hidden" value={title} name="title" />

            <div className="input-control">
                <input 
                    value={amount}  
                    type="text" 
                    name="amount" 
                    placeholder="Số tiền thu nhập"
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
                <select required value={category} name="category" onChange={handleCategoryChange}>
                    <option value="" disabled>Chọn nhóm thu nhập</option>
                    {Object.entries(allCategories).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                    <option value="add-new">+ Thêm nhóm thu nhập mới</option>
                </select>
            </div>

            {addingCategory && (
                <div className="add-category-box" ref={addCategoryRef}>
                    <input 
                        type="text" 
                        value={newCategory}
                        placeholder="Nhập tên nhóm thu nhập mới"
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button type="button" onClick={handleAddNewCategory}>Thêm nhóm</button>
                </div>
            )}

            <div className="input-control">
                <textarea 
                    name="description" 
                    value={description} 
                    placeholder="Thêm mô tả" 
                    onChange={handleInput('description')}
                />
            </div>

            <div className="submit-btn">
                <Button 
                    name={'Thêm thu nhập'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
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
        border: 2px solid #fff;
        border-radius: 8px;
        padding: 0.6rem 1rem;
        background: #fff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        width: 100%;

        .react-datepicker-wrapper {
            width: 100%;
        }

        textarea {
            min-height: 80px;
        }
    }

    .selects {
        select {
            width: 100%;
            background: #fff;
            color: rgba(34, 34, 96, 0.6);
            transition: 0.3s;

            &:focus,
            &:active {
                color: rgba(34, 34, 96, 1);
                border-color: var(--color-accent);
            }

            option[value="add-new"] {
                font-weight: bold;
                color: #2193b0;
                background-color: #f0faff;
            }
        }
    }

    .add-category-box {
        background: #f5f9ff;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        animation: fadeIn 0.3s ease-in-out;

        input {
            border: 1.5px solid rgba(34, 34, 96, 0.2);
        }

        button {
            align-self: flex-start;
            padding: 0.5rem 1rem;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;

            &:hover {
                background: linear-gradient(to right, #6dd5ed, #2193b0);
            }
        }
    }

    .submit-btn {
        display: flex;
        justify-content: flex-end;

        button {
            white-space: nowrap;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 600px) {
        gap: 1rem;
        .submit-btn {
            justify-content: center;
        }

        .add-category-box {
            padding: 0.8rem;
        }
    }
`;

export default Form
