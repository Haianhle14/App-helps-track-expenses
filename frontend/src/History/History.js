import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History() {
    const { transactionHistory } = useGlobalContext()

    const history = transactionHistory()

    return (
        <HistoryStyled>
            <div>
                <h2>Lịch sử gần đây</h2>
            </div>
            {history.map((item) => {
                const { _id, title, amount, type } = item;

                // Xác định màu sắc và dấu hiệu dựa trên loại giao dịch
                const isExpense = type === 'Chi tiêu';
                const color = isExpense ? 'red' : 'var(--color-green)';
                const sign = isExpense ? '-' : '+';

                return (
                    <div key={_id} className="history-item">
                        <p style={{ color }}>
                            {`${title} (${type})`}
                        </p>

                        <p style={{ color }}>
                            {`${sign}${amount <= 0 ? 0 : amount}`}
                        </p>
                    </div>
                )
            })}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
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
`;

export default History;
