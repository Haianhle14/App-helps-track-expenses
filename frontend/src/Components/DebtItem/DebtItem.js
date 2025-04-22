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
                            <p>{money}{Number(amount).toLocaleString('vi-VN')}đ</p>
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
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;

    .icon {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        border-radius: 15px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        i {
            font-size: 2.2rem;
        }
    }

    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h5 {
            font-size: 1.1rem;
            padding-left: 1.5rem;
            position: relative;
            margin: 0;
            word-break: break-word;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 0.7rem;
                height: 0.7rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            @media (min-width: 600px) {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            .text {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                gap: 1rem;

                p {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                    font-size: 0.95rem;
                    word-break: break-word;
                }
            }

            .btn-con {
                display: flex;
                justify-content: flex-end;
                gap: 0.8rem;
                padding-left: 0;

                button {
                    flex-shrink: 0;
                }
            }
        }
    }

    @media (max-width: 500px) {
        .icon {
            width: 50px;
            height: 50px;
        }

        .content h5 {
            font-size: 1rem;
        }

        .inner-content .text p {
            font-size: 0.85rem;
        }
    }
`;

export default DebtItem;
