import { useState, /* useEffect */} from 'react';
// import { toast } from 'react-toastify';
import styled from 'styled-components'
import SecurityIcon from '@mui/icons-material/Security';
// import { get2FA_QRCodeAPI, setup2FA_API } from '~/apis';

function Setup2FA({ isOpen, toggleOpen, user, handleSuccessSetup2FA }) {
  const [otpToken, setConfirmOtpToken] = useState('');
  const [error, /*setError*/] = useState(null);
  const [qrCodeImageUrl, /*setQrCodeImageUrl*/] = useState(null);

  // useEffect(() => {
  //   if (isOpen) {
  //     get2FA_QRCodeAPI(user._id).then(res => {
  //       setQrCodeImageUrl(res.qrcode);
  //     });
  //   }
  // }, [isOpen, user._id]);

  const handleCloseModal = () => {
    toggleOpen(!isOpen);
  };

  // const handleConfirmSetup2FA = () => {
  //   if (!otpToken) {
  //     const errMsg = 'Vui lòng nhập mã OTP.';
  //     setError(errMsg);
  //     toast.error(errMsg);
  //     return;
  //   }

  //   setup2FA_API(user._id, otpToken).then(updatedUser => {
  //     toast.success('Xác minh 2 bước thiết lập thành công!');
  //     handleSuccessSetup2FA(updatedUser);
  //     setError(null);
  //   });
  // };

  return (
    isOpen && (
      <ModalOverlay>
        <CloseButton onClick={handleCloseModal}>×</CloseButton>
        <ModalContainer>
          <Header>
            <SecurityIcon style={{ color: '#222260', fontSize: '24px' }} />
            <h2>Xác minh 2 bước</h2>
          </Header>
          <p>Quét mã QR bằng ứng dụng <strong>Google Authenticator</strong> hoặc <strong>Authy</strong>.</p>

          {/* QR Code */}
          <QRCodeWrapper>
            {!qrCodeImageUrl ? (
              <p>Đang tải mã QR...</p>
            ) : (
              <img src={qrCodeImageUrl} alt="2FA QR Code" />
            )}
          </QRCodeWrapper>

          {/* Nhập OTP */}
          <label htmlFor="otp">Nhập mã OTP</label>
          <input
            id="otp"
            type="text"
            value={otpToken}
            onChange={(e) => setConfirmOtpToken(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Nút xác nhận */}
          <button>Xác nhận</button>
        </ModalContainer>
      </ModalOverlay>
    )
  );
};

// Styled Components
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const QRCodeWrapper = styled.div`
  margin: 1rem 0;
  img {
    width: 180px;
    height: 180px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;



export default Setup2FA;
