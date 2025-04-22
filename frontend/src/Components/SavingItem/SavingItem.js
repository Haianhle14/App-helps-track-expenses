import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { money, trash } from '../../utils/Icons'
import ConfirmModal from '../../utils/ConfirmModal'
import { toast } from 'react-toastify'

function SavingItem({ _id, goal, targetAmount, currentAmount, updateProgress, deleteItem, indicatorColor = "#6dd5ed" }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
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
        setShowUpdateModal(true)
    }

    const confirmUpdateProgress = (newAmount) => {
        const totalAmount = parseFloat(current) + newAmount
        setCurrent(totalAmount)
        updateProgress(_id, totalAmount)
        toast.success('Cập nhật tiến độ thành công!')
        setShowUpdateModal(false)
    }

    return (
        <>
            <SavingItemStyled indicator={indicatorColor}>
                <div className="icon">{money}</div>
                <div className="content">
                    <h5>Mục tiêu: {goal}</h5>
                    <div className="inner-content">
                        <div className="text">
                            <p>{money} {Number(current).toLocaleString('vi-VN')}/{Number(targetAmount).toLocaleString('vi-VN')}đ</p>
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

            {showUpdateModal && (
                <UpdateProgressModal
                    onClose={() => setShowUpdateModal(false)}
                    onSubmit={confirmUpdateProgress}
                />
            )}
        </>
    )
}

// Modal cập nhật tiến độ
const UpdateProgressModal = ({ onClose, onSubmit }) => {
    const [amount, setAmount] = useState('')

    const handleSubmit = () => {
        if (!isNaN(amount) && amount.trim() !== '') {
            onSubmit(parseFloat(amount))
        } else {
            toast.error('Vui lòng nhập một số hợp lệ!')
        }
    }

    return (
        <ModalOverlay>
            <ModalContent>
                <h3>Cập nhật tiến độ</h3>
                <input
                    type="number"
                    placeholder="Nhập số tiền muốn thêm"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Xác nhận</button>
                    <button onClick={onClose} className="cancel">Hủy</button>
                </div>
            </ModalContent>
        </ModalOverlay>
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: -200px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
    width: 320px;
    text-align: center;

    h3 {
        margin-bottom: 1rem;
        color: #222260;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
    }

    .modal-actions {
        display: flex;
        justify-content: space-between;

        button {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;

            &:first-child {
                background: var(--color-accent);
                color: white;
            }

            &.cancel {
                background: #ddd;
                color: #333;
            }

            &:hover {
                transform: scale(1.05);
            }
        }
    }
`;

export default SavingItem
