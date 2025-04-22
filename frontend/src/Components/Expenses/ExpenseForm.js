import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useGlobalContext } from '../../context/globalContext'
import Button from '../Button/Button'
import { plus } from '../../utils/Icons'
import { toast } from 'react-toastify'

const initialSubCategoryOptions = {
    'Hóa đơn & Tiện ích': ['Thuê nhà', 'Hóa đơn điện thoại', 'Hóa đơn điện', 'Hóa đơn nước', 'Hóa đơn gas', 'Hóa đơn TV', 'Hóa đơn Internet', 'Hóa đơn tiện ích khác'],
    'Mua sắm': ['Đồ dùng cá nhân', 'Đồ gia dụng', 'Làm đẹp'],
    'Giải trí': ['Dịch vụ trực tuyến', 'Vui chơi'],
    'Gia đình': ['Sửa & trang trí nhà', 'Dịch vụ gia đình', 'Vật nuôi'],
    'Sức khỏe': ['Thuốc', 'Khám sức khỏe', 'Bảo hiểm y tế', 'Thể dục thể thao'],
    'Ăn uống': ['Ăn nhà hàng', 'Đặt đồ ăn online'],
    'Di chuyển': ['Bảo dưỡng xe', 'Xăng xe', 'Gửi xe', 'Vé xe', 'Vé máy bay'],
    'Khoản chi chưa phân loại': ['Khoản chi chưa phân loại']
}

function ExpenseForm() {
    const { addExpense } = useGlobalContext()
    const [inputState, setInputState] = useState({
        amount: '',
        date: '',
        category: '',
        subCategory: '',
        description: '',
    })
    const [subCategoryOptions, setSubCategoryOptions] = useState(initialSubCategoryOptions)
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [showNewSubInput, setShowNewSubInput] = useState(false)
    const [newSubCategory, setNewSubCategory] = useState('')

    const categoryRef = useRef()
    const subRef = useRef()

    const { amount, date, category, subCategory, description } = inputState

    useEffect(() => {
        const handleClickOutside = e => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setShowNewCategoryInput(false)
                setNewCategory('')
            }
            if (subRef.current && !subRef.current.contains(e.target)) {
                setShowNewSubInput(false)
                setNewSubCategory('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value })
    }

    const handleCategoryChange = e => {
        const newCategory = e.target.value
        setInputState({
            ...inputState,
            category: newCategory,
            subCategory: ''
        })
        setShowNewSubInput(false)
        setNewSubCategory('')
    }

    const handleAddNewCategory = () => {
        const key = newCategory.trim()
        if (!key || subCategoryOptions[key]) return

        const updated = {
            ...subCategoryOptions,
            [key]: []
        }

        setSubCategoryOptions(updated)
        setInputState({
            ...inputState,
            category: key,
            subCategory: ''
        })
        setNewCategory('')
        setShowNewCategoryInput(false)
    }

    const handleAddNewSubCategory = () => {
        if (newSubCategory.trim() === '' || !category) return
        setSubCategoryOptions(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), newSubCategory]
        }))
        setInputState({ ...inputState, subCategory: newSubCategory })
        setNewSubCategory('')
        setShowNewSubInput(false)
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (!subCategory) {
            toast.error('Vui lòng chọn khoản chi cụ thể.')
            return
        }

        const dataToSend = {
            ...inputState,
            title: subCategory
        }

        try {
            await addExpense(dataToSend)
            toast.success('Thêm chi tiêu thành công!')
            setInputState({
                amount: '',
                date: '',
                category: '',
                subCategory: '',
                description: '',
            })
        } catch (err) {
            toast.error('Thêm chi tiêu thất bại')
        }
    }

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <input 
                    value={amount}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Số tiền chi tiêu'}
                    onChange={handleInput('amount')} 
                />
            </div>
            <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Nhập ngày'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setInputState({ ...inputState, date })}
                />
            </div>

            <div className="selects input-control" ref={categoryRef}>
                <select value={category} name="category" id="category" onChange={handleCategoryChange}>
                    <option value="" disabled>Chọn nhóm chi tiêu</option>
                    {Object.keys(subCategoryOptions).map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>

                {!showNewCategoryInput ? (
                    <button type="button" className="add-btn" onClick={() => setShowNewCategoryInput(true)}>
                        + Thêm nhóm chi tiêu
                    </button>
                ) : (
                    <div className="new-category">
                        <input 
                            type="text" 
                            placeholder="Nhập tên nhóm mới" 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button type="button" onClick={handleAddNewCategory}>Thêm</button>
                    </div>
                )}
            </div>

            {category && subCategoryOptions[category] && (
                <>
                    <div className="selects input-control">
                        <select 
                            value={subCategory} 
                            name="subCategory" 
                            onChange={handleInput('subCategory')}
                        >
                            <option value="" disabled>Chọn khoản chi cụ thể</option>
                            {subCategoryOptions[category].map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-control add-sub" ref={subRef}>
                        {!showNewSubInput ? (
                            <button type="button" onClick={() => setShowNewSubInput(true)}>+ Thêm khoản chi cụ thể</button>
                        ) : (
                            <div className="new-sub-category">
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên khoản chi mới" 
                                    value={newSubCategory}
                                    onChange={(e) => setNewSubCategory(e.target.value)}
                                />
                                <button type="button" onClick={handleAddNewSubCategory}>Thêm</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="input-control">
                <textarea 
                    name="description" 
                    value={description} 
                    placeholder='Thêm mô tả chi tiết' 
                    cols="30" 
                    rows="4" 
                    onChange={handleInput('description')}
                />
            </div>
            <div className="submit-btn">
                <Button 
                    name={'Thêm chi tiêu'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>
        </ExpenseFormStyled>
    )
}

const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    width: 100%;

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

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        width: 100%;
        textarea {
            min-height: 80px;
        }

        .react-datepicker-wrapper {
            width: 100%;
            input {
                width: 100%;
            }
        }

        &.add-sub {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            button {
                margin-top: 0.5rem;
                padding: 0.4rem 1rem;
                font-size: 0.9rem;
                color: var(--color-accent);
                background: none;
                border: none;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }

            .new-sub-category {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
                width: 100%;

                input {
                    flex: 1;
                }

                button {
                    padding: 0.4rem 1rem;
                    background: var(--color-accent);
                    color: white;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    border: none;
                    cursor: pointer;

                    &:hover {
                        background: linear-gradient(to right, #6dd5ed, #2193b0);
                    }
                }
            }
        }
    }

    .selects {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        select {
            background: #fff;
            color: rgba(34, 34, 96, 0.6);

            &:focus {
                color: rgba(34, 34, 96, 1);
            }
        }

        .add-btn {
            align-self: flex-end;
            margin-top: 0.3rem;
            padding: 0.4rem 1rem;
            font-size: 0.9rem;
            background: none;
            color: var(--color-accent);
            border: none;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }

        .new-category {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;

            input {
                flex: 1;
            }

            button {
                padding: 0.4rem 1rem;
                background: var(--color-accent);
                color: white;
                border-radius: 8px;
                font-size: 0.9rem;
                border: none;
                cursor: pointer;

                &:hover {
                    background: linear-gradient(to right, #6dd5ed, #2193b0);
                }
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

    @media (max-width: 600px) {
        gap: 1rem;
        input, textarea, select {
            font-size: 0.95rem;
            padding: 0.5rem 0.8rem;
        }

        .submit-btn {
            justify-content: center;
        }

        .selects {
            .new-category, .new-sub-category {
                flex-direction: column;
                button {
                    width: 100%;
                }
            }
        }
    }
`

export default ExpenseForm
