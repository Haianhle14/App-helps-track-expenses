import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { money, trash } from '../../utils/Icons'
import ConfirmModal from '../../utils/ConfirmModal'
import { toast } from 'react-toastify'

function SavingItem({ _id, goal, targetAmount, currentAmount, updateProgress, deleteItem, indicatorColor = "#6dd5ed" }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [current, setCurrent] = useState(currentAmount)
    
    
    useEffect(() => {
        setCurrent(currentAmount)
    }, [currentAmount])

    const progressPercentage = ((current / targetAmount) * 100).toFixed(2)

    const handleDelete = () => setShowConfirm(true)

    const confirmDelete = () => {
        deleteItem(_id)
        toast.success('Đã xóa mục tiêu thành công!')
        setShowConfirm(false)
    }

    const handleUpdateProgress = () => {
        const newAmount = prompt('Nhập số tiền bạn muốn thêm vào:', '0')
        if (newAmount && !isNaN(newAmount)) {
            const totalAmount = parseFloat(current) + parseFloat(newAmount)
            setCurrent(totalAmount)
            updateProgress(_id, totalAmount)
            toast.success('Cập nhật tiến độ thành công!')
        } else {
            toast.error('Vui lòng nhập một số hợp lệ!')
        }
    }

    return (
        <>
            <SavingItemStyled indicator={indicatorColor}>
                <div className="icon">{money}</div>
                <div className="content">
                    <h5>Mục tiêu: {goal}</h5>
                    <div className="inner-content">
                        <div className="text">
                            <p>{money} {current}/{targetAmount}đ</p>
                            <p>Tiến độ: {progressPercentage}%</p>
                        </div>
                        <div className="btn-con">
                            <UpdateButtonStyled onClick={handleUpdateProgress}>
                                Cập nhật tiến độ
                            </UpdateButtonStyled>
                            <DeleteButtonStyled onClick={handleDelete}>
                                <i>{trash}</i>
                            </DeleteButtonStyled>
                        </div>
                    </div>
                </div>
            </SavingItemStyled>

            {showConfirm && (
                <ConfirmModal
                    message="Bạn có chắc chắn muốn xóa mục tiêu này không?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    )
}





const SavingItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;

    .icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        i {
            font-size: 2.6rem;
        }
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h5 {
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                p {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
            }

            .btn-con {
                display: flex;
                gap: 1rem;
                padding: 0 0 0 1rem;
            }
        }
    }
`;

const UpdateButtonStyled = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: var(--color-accent);
    font-size: 0.9rem;
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(to right, #6dd5ed, #2193b0);
        transform: scale(1.05);
    }
`;

const DeleteButtonStyled = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--color-delete);
        transform: scale(1.05);
    }

    i {
        font-size: 1.2rem;
    }
`;

export default SavingItem;
