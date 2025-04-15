import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';

const SearchTransactionModal = ({ onClose }) => {
  const { filterTransactions } = useGlobalContext();

  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("📝 Field changed:", name, "➡️", value);
    setFilters({ ...filters, [name]: value });
  };

  const typeMap = {
    'thu nhập': 'income',
    'chi tiêu': 'expense',
    'cho vay': 'lend',
    'vay': 'borrow',
    'tiết kiệm': 'saving',
  };

  const reverseTypeMap = {
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    lend: 'Cho vay',
    borrow: 'Vay',
    saving: 'Tiết kiệm'
  };

  const adjustedFilters = {
    ...filters,
    type: typeMap[filters.type.toLowerCase()] || '',
  };

  console.log("Raw filter input:", filters);
  console.log("Mapped filter type:", adjustedFilters.type);

  const filtered = typeof filterTransactions === 'function'
    ? filterTransactions(adjustedFilters)
    : [];

  return (
    <Overlay>
      <CloseButton onClick={onClose}>×</CloseButton>
      <ModalBox>
        <div className="header">
          <h2>Tìm kiếm giao dịch</h2>
        </div>
        <div className="filters">
          <input
            type="text"
            name="keyword"
            placeholder="🔍 Từ khóa"
            value={filters.keyword}
            onChange={handleChange}
          />
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">Tất cả loại</option>
            <option value="thu nhập">Thu nhập</option>
            <option value="chi tiêu">Chi tiêu</option>
            <option value="cho vay">Cho vay</option>
            <option value="vay">Vay</option>
            <option value="tiết kiệm">Tiết kiệm</option>
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </div>
        <div className="results">
          {filtered.map((txn, index) => {
            const displayTitle = txn.title || txn.goal || 'Không có tiêu đề';
            const displayAmount = (txn.amount || txn.targetAmount || 0).toLocaleString('vi-VN');
            const rawType = txn.type || (txn.goal ? 'saving' : '');
            const displayType = reverseTypeMap[rawType];

            return (
              <div key={index} className="txn">
                <p><strong>{displayTitle}</strong></p>
                <p>{displayAmount}đ <em>{displayType}</em></p>
              </div>
            );
          })}
          {filtered.length === 0 && <p>Không tìm thấy giao dịch nào phù hợp.</p>}
        </div>
      </ModalBox>
    </Overlay>
  );
};

export default SearchTransactionModal;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: -210px;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  background: linear-gradient(135deg, #fff, #e6f7ff);
  padding: 2rem;
  border-radius: 16px;
  width: 500px;
  max-height: 90vh;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }

  .header h2 {
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;

    input, select {
      padding: 0.6rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }
  }

  .results {
    .txn {
      background: #fff;
      margin-bottom: 0.6rem;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
      box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.03);

      p {
        margin: 0.2rem 0;
        font-size: 1rem;
      }

      em {
        color: #666;
      }
    }

    .txn:last-child {
      margin-bottom: 0;
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
  z-index: 1001;
`;
