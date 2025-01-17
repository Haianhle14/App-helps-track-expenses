import React from 'react';
import styled from 'styled-components';
import { money, trash } from '../../utils/Icons';
import Button from '../Button/Button';

function SavingItem({ id, goal, targetAmount, currentAmount, updateProgress, deleteItem, indicatorColor }) {
    if (!id) {
        console.error('SavingItem received undefined id!', { goal, targetAmount, currentAmount });
    }
    const progressPercentage = ((currentAmount / targetAmount) * 100).toFixed(2);

    return (
        <SavingItemStyled indicator={indicatorColor}>
            <div className="icon">
                {money}
            </div>
            <div className="content">
                <h5>{goal}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>Tiến độ: {money}{currentAmount}/{targetAmount}đ ({progressPercentage}%)</p>
                    </div>
                    <div className="btn-con">
                        <Button
                            text="Cập nhật"
                            bPad={'0.5rem 1rem'}
                            bRad={'12px'}
                            bg={'var(--color-green)'}
                            color={'#fff'}
                            onClick={() => {
                                const newAmount = prompt('Nhập số tiền bạn muốn thêm vào:', '0');
                                if (newAmount && !isNaN(newAmount)) {
                                    const totalAmount = parseFloat(currentAmount) + parseFloat(newAmount);
                                    updateProgress(id, totalAmount);
                                } else {
                                    alert('Vui lòng nhập một số hợp lệ!');
                                }
                            }}
                        />
                        <Button
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--color-delete)'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'#ff6b6b'}
                            onClick={() => {
                                console.log('ID to delete:', id);
                                deleteItem(id)}
                            }
                        />
                    </div>
                </div>
            </div>
        </SavingItemStyled>
    );
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
        }
    }
`;

export default SavingItem;
