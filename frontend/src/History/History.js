import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History() {
    const { transactionHistory } = useGlobalContext();

    const history = transactionHistory();

    return (
        <HistoryStyled>
            <h2>Lịch sử gần đây</h2>
            {history.map((item) => {
                const { _id, title, amount, currentAmount, type, borrower, lender } = item;

                // Xác định tiêu đề cho loại giao dịch nợ vay và nợ cho vay
                let displayTitle = title;
                if (type === 'Vay, Nợ') {
                    if (borrower) {
                        displayTitle = `Trả nợ`; // Nợ vay
                    } else if (lender) {
                        displayTitle = `Cho vay`; // Nợ cho vay
                    }
                }

                // Xác định số tiền hiển thị: dùng `currentAmount` cho "Mục tiêu", ngược lại dùng `amount`
                const displayAmount = type === 'Mục tiêu' ? currentAmount : amount;

                // Xác định màu sắc và dấu hiệu dựa trên loại giao dịch
                const isExpense = type === 'Chi tiêu' || type === 'Vay, Nợ';
                const color = isExpense ? 'red' : 'var(--color-green)';
                const sign = isExpense ? '-' : '+';

                return (
                    <div key={_id} className="history-item">
                        <p style={{ color }}>
                            {`${displayTitle} (${type})`}
                        </p>

                        <p style={{ color }}>
                            {`${sign}${displayAmount <= 0 ? 0 : displayAmount}`}
                        </p>
                    </div>
                );
            })}
        </HistoryStyled>
    );
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
        display: inline-flex; /* Sử dụng inline-flex để các phần tử con nằm trong cùng một dòng */
        justify-content: center;
        align-items: center;
        cursor: pointer; /* Thêm hiệu ứng con trỏ khi hover */
    }

    i {
        margin-right: 0.2rem; /* Giảm khoảng cách giữa icon và văn bản */
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
