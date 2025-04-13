import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

function Disable2FAModal({ isOpen, toggleOpen, user, handleSuccessDisable2FA }) {
  const [otpToken, setOtpToken] = useState('');
  const [error, setError] = useState(null);
  const { disable2FA } = useGlobalContext();

  const handleCloseModal = () => {
    toggleOpen(!isOpen);
  };

  const handleDisable2FA = () => {
    if (!otpToken) {
      const errMsg = 'Vui lòng nhập mã OTP.';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    disable2FA(user._id, otpToken)
      .then(() => {
        toast.success('Xác minh 2 bước đã được tắt thành công!');
        handleSuccessDisable2FA();
        setError(null);
        handleCloseModal();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Xác minh OTP thất bại.';
        setError(msg);
        toast.error(msg);
      });
  };

  return (
    isOpen && (
      <ModalOverlay>
        <CloseButton onClick={handleCloseModal}>×</CloseButton>
        <ModalContainer>
          <Header>
            <h2>Tắt xác minh 2 bước</h2>
          </Header>
          <p>Nhập mã OTP để tắt xác minh 2 bước.</p>

          <label htmlFor="otp">Nhập mã OTP</label>
          <input
            id="otp"
            type="text"
            value={otpToken}
            onChange={(e) => setOtpToken(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <button onClick={handleDisable2FA}>Tắt xác minh 2 bước</button>
        </ModalContainer>
      </ModalOverlay>
    )
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: -200px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: white;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;

  h2 {
    color: #222260;
  }

  p {
    font-size: 0.95rem;
    color: #555;
  }

  label {
    display: block;
    margin: 0.5rem 0;
    font-weight: 500;
    color: #333;
  }

  input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  button {
    background: linear-gradient(to right, #6dd5ed, #2193b0);
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
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
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

export default Disable2FAModal;
