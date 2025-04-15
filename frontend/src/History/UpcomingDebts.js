import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/globalContext'
import styled from 'styled-components'

const UpcomingDebts = () => {
    const { getUpcomingDebtsReminder } = useGlobalContext();
    const [upcomingDebts, setUpcomingDebts] = useState([]);

    useEffect(() => {
        const reminders = getUpcomingDebtsReminder(7);
        setUpcomingDebts(reminders);
    }, [getUpcomingDebtsReminder]);

    if (upcomingDebts.length === 0) {
        return (
            <StyledDebts>
                <div className="empty-state">Không có khoản nợ nào sắp đến hạn!</div>
            </StyledDebts>
        )
    }

    return (
        <StyledDebts>
            <div className="header">
                <span className="icon">🔔</span>
                <span className="title">Nợ sắp đến hạn</span>
            </div>
            <ul className="debt-list">
                {upcomingDebts.map(debt => {
                const isBorrow = debt.type === 'borrow';
                const name = isBorrow ? debt.lender : debt.borrower;
                const label = isBorrow ? 'Bạn cần trả' : 'Người khác nợ bạn';
                const icon = isBorrow ? '🔻' : '🔺';
                const contextText = isBorrow
                    ? `Vay từ ${name || 'Không rõ'}`
                    : `Cho ${name || 'Không rõ'} vay`;

                return (
                    <li key={debt._id} className="debt-card">
                        <div className="top-row">
                            <span className="context">
                                {icon} <strong>{contextText}</strong>
                            </span>
                            <span className="date">
                                {new Date(debt.dueDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="bottom-row">
                            {label}: <strong>{debt.amount.toLocaleString()}₫</strong>
                        </div>
                    </li>
                );
                })}
            </ul>
        </StyledDebts>
    )
}
const StyledDebts = styled.div`
    background: #fff;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    font-size: 0.92rem;
    max-height: none; /* bỏ max-height tổng thể */
    width: 100%;

    .debt-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        max-height: 11.5rem; /* mỗi item khoảng ~3.6rem => 3 items */
        overflow-y: auto;
        padding-right: 0.3rem;
    }

    .header {
        display: flex;
        align-items: center;
        font-weight: 600;
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #d63031;

        .icon {
            font-size: 1.2rem;
            margin-right: 0.5rem;
        }
    }

    .debt-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        border-left: 4px solid #d63031;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        transition: background 0.2s;

        &:hover {
            background: #f1f2f6;
        }

        .top-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;

            .context {
                color: #2d3436;
            }

            .date {
                font-size: 0.75rem;
                color: #e17055;
                font-weight: 500;
                white-space: nowrap;
            }
        }

        .bottom-row {
            color: #636e72;
        }
    }

    .empty-state {
        text-align: center;
        color: #95a5a6;
        font-style: italic;
    }

    .debt-list::-webkit-scrollbar {
        width: 6px;
    }

    .debt-list::-webkit-scrollbar-thumb {
        background: #dcdde1;
        border-radius: 8px;
    }
`

export default UpcomingDebts
