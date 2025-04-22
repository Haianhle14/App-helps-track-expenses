import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History({ onClickViewAll }) {
    const { transactionHistory } = useGlobalContext();
    const history = typeof transactionHistory === 'function' ? transactionHistory() : transactionHistory;

    return (
        <HistoryStyled>
            <div className="header">
                <h2>Lịch sử gần đây</h2>
                {onClickViewAll && (
                    <button className="view-all-btn" onClick={onClickViewAll}>
                        Xem tất cả
                    </button>
                )}
            </div>

            {history && history.length > 0 ? (
                history
                    .filter(item => item.type !== 'Mục tiêu')
                    .map((item, index) => {
                        const { _id, title, amount, type } = item;

                        const isExpense = type === 'Chi tiêu';
                        const color = isExpense ? 'red' : 'var(--color-green)';
                        const sign = isExpense ? '-' : '+';

                        const formattedAmount = (typeof amount === 'number' && !isNaN(amount)) 
                            ? amount.toLocaleString('vi-VN')
                            : '0';

                        return (
                            <div key={_id || index} className="history-item">
                                <p style={{ color }}>
                                    {`${title} (${type})`}
                                </p>

                                <p style={{ color }}>
                                    {`${sign}${formattedAmount}`}
                                </p>
                            </div>
                        );
                    })
            ) : (
                <p className="no-data-text">Không có dữ liệu</p>
            )}
        </HistoryStyled>
    );
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h2 {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .view-all-btn {
            padding: 0.4rem 0.8rem;
            background: #5fd2c9;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.3s ease;

            &:hover {
                background: #44b5af;
            }
        }
    }

    .history-item {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        }

        p {
            margin: 0;
            font-size: 1rem;
            font-weight: bold;
        }
    }

    .no-data-text {
        text-align: center;
        color: #888;
        font-size: 1rem;
        font-weight: normal;
    }
`;

export default History;
