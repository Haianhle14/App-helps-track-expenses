import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';

import DebtItem from '../DebtItem/DebtItem';
import DebtForm from './DebtForm';

function Debts() {
    const { debts, getDebts, deleteDebt, totalDebts } = useGlobalContext();

    useEffect(() => {
        getDebts();
    }, [getDebts]);

    return (
        <DebtStyled>
            <InnerLayout>
                <h1>Quản Lý Vay Và Cho Vay</h1>
                <h2 className="total-debt">
                    Tổng số tiền liên quan: <span>{totalDebts()}đ</span>
                </h2>
                <div className="debt-content">
                    <div className="form-container">
                        <DebtForm />
                    </div>
                    <div className="debts">
                        {debts.map((debt) => {
                            const { _id, type, amount, borrower, lender, dueDate, description } = debt;
                            return (
                                <DebtItem
                                    key={_id}
                                    id={_id}
                                    type={type}
                                    amount={amount}
                                    borrower={borrower}
                                    lender={lender}
                                    dueDate={dueDate}
                                    description={description}
                                    deleteItem={deleteDebt}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </DebtStyled>
    );
}

const DebtStyled = styled.div`
    height: 100vh;
    overflow-y: auto;
    overflow-x: scroll;
    
    /* Dành cho trình duyệt WebKit (Chrome, Safari):
       - width: 0px sẽ ẩn thanh cuộn theo chiều dọc (vì nó sử dụng chiều rộng của scrollbar)
       - height: 12px (hoặc giá trị bạn mong muốn) sẽ giữ lại thanh cuộn ngang */
    &::-webkit-scrollbar {
        width: 0px;    /* Ẩn scrollbar dọc */
        height: 12px;  /* Hiển thị scrollbar ngang với chiều cao 12px */
    }

    /* Trên Firefox, bạn không thể tách riêng từng chiều dễ dàng.
       Nếu cần thiết, bạn có thể sử dụng các thư viện CSS hoặc custom scrollbar plugin để tùy biến riêng.
       Hoặc sử dụng:
       scrollbar-width: thin;  (thanh cuộn sẽ hiển thị ở dạng mỏng)
       */
    scrollbar-width: thin;
    -ms-overflow-style: auto; /* IE 10+ */

    .total-debt {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: 0.5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .debt-content {
        display: flex;
        gap: 2rem;

        .debts {
            flex: 1;
        }
    }
`




export default Debts;
