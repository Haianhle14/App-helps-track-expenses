import React, { useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { dateFormat } from '../../utils/dateFormat';
import { calender, piggy, users, trash, comment, money } from '../../utils/Icons'
import Button from '../Button/Button';
import ConfirmDeleteModal from '../../utils/ConfirmModal'

function DebtItem({
    id,
    amount,
    dueDate,
    borrower,
    lender,
    description,
    deleteItem,
    indicatorColor,
    type
}) {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        deleteItem(id)
        toast.success('Xóa khoản vay/cho vay thành công!')
        setShowModal(false)
    }

    const debtCategoryIcon = () => {
        switch (type) {
            case 'borrow':
                return piggy
            case 'lend':
                return users
            default:
                return ''
        }
    }

    return (
        <>
            <DebtItemStyled indicator={indicatorColor}>
                <div className="icon">{debtCategoryIcon()}</div>
                <div className="content">
                    <h5>{type === 'borrow' ? `Vay từ ${lender}` : `Cho ${borrower} vay`}</h5>
                    <div className="inner-content">
                        <div className="text">
                            <p>{money}{amount}đ</p>
                            <p>{calender}{dateFormat(dueDate)}</p>
                            <p>{comment}{description}</p>
                        </div>
                        <div className="btn-con">
                            <Button
                                icon={trash}
                                bPad={'1rem'}
                                bRad={'50%'}
                                bg={'var(--primary-color)'}
                                color={'#fff'}
                                iColor={'#fff'}
                                hColor={'var(--color-green)'}
                                onClick={() => setShowModal(true)}
                            />
                        </div>
                    </div>
                </div>
            </DebtItemStyled>

            {showModal && (
                <ConfirmDeleteModal
                    message="Bạn có chắc chắn muốn xóa khoản vay/cho vay này không?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    )
}

const DebtItemStyled = styled.div`
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
        gap: .2rem;

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
                align-items: center;
                gap: 1.5rem;
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

export default DebtItem;
