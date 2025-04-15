import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';

const ShowFullHistoryModal = ({ onClose }) => {
  const { incomes, expenses, debts, savingsProgress } = useGlobalContext();
  const { totalCurrent } = savingsProgress();

  const allHistory = [
    ...incomes.map(item => ({ ...item, type: 'Thu nhập' })),
    ...expenses.map(item => ({ ...item, type: 'Chi tiêu' })),
    ...debts.map(item => {
      const isLend = item.type === 'lend';
      return {
        ...item,
        type: isLend ? 'Cho vay' : 'Đi vay',
        title: isLend ? `Cho ${item.borrower} vay` : `Vay từ ${item.lender}`
      };
    }),
    {
      title: 'Tiết kiệm',
      amount: totalCurrent,
      type: 'Tiết kiệm',
      createdAt: new Date().toISOString()
    },
  ];
  

  const sortedHistory = allHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getSignAndColor = (type) => {
    const positiveTypes = ['Thu nhập', 'Đi vay', 'Tiết kiệm'];
    const isPositive = positiveTypes.includes(type);
    return {
      sign: isPositive ? '+' : '-',
      colorClass: isPositive ? 'positive' : 'negative'
    };
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Thu nhập': return '💰';
      case 'Chi tiêu': return '🛒';
      case 'Cho vay': return '📤';
      case 'Đi vay': return '📥';
      case 'Tiết kiệm': return '🏦';
      default: return '🔔';
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hour}:${minute}`;
  };

  return (
    <Overlay>
      <CloseButton onClick={onClose}>×</CloseButton>
      <ModalBox>
        <h2>Lịch sử giao dịch</h2>
        <div className="history-list">
          {sortedHistory.map((item, index) => {
            const { sign, colorClass } = getSignAndColor(item.type);
            const icon = getIcon(item.type);
            return (
              <div key={index} className="history-item">
                <div className="left">
                  <span className="icon">{icon}</span>
                  <div className="info">
                    <span className="title">{item.title}</span>
                    <span className="date">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="right">
                  <span className={`amount ${colorClass}`}>
                    {sign}{item.amount.toLocaleString()}đ
                  </span>
                  <span className="type">({item.type})</span>
                </div>
              </div>
            );
          })}
        </div>
      </ModalBox>
    </Overlay>
  );
};

export default ShowFullHistoryModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: -210px;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 600px;
  max-height: 80vh;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);

  &::-webkit-scrollbar {
    display: none;
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .history-item {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;

    .left {
      display: flex;
      gap: 0.8rem;
      align-items: center;

      .icon {
        font-size: 1.5rem;
      }

      .info {
        display: flex;
        flex-direction: column;

        .title {
          font-weight: 600;
        }

        .date {
          font-size: 0.85rem;
          color: #999;
        }
      }
    }

    .right {
      text-align: right;

      .amount.positive {
        color: green;
        font-weight: bold;
      }

      .amount.negative {
        color: red;
        font-weight: bold;
      }

      .type {
        font-size: 0.85rem;
        color: #777;
      }
    }
  }
`;


const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  z-index: 1000;
`;
