// Author: TrungQuanDev | https://youtube.com/@trungquandev
import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useGlobalContext } from '../../context/globalContext'
// Tài liệu về Material Modal rất dễ ở đây: https://mui.com/material-ui/react-modal/
function Require2FA({ user, handleSuccessVerify2FA }) {
  const [otpToken, setConfirmOtpToken] = useState('');
  const [error, setError] = useState(null);
  const { verify2FA } = useGlobalContext();

  const handleRequire2FA = async () => {
    if (!otpToken) {
      const errMsg = 'Vui lòng nhập mã OTP.';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    try {
      const updatedUser = await verify2FA(user._id, otpToken);  // Gọi API xác thực 2FA
      handleSuccessVerify2FA(updatedUser);  // Xử lý thành công
      toast.success('Xác thực 2FA thành công!');
      setError(null);
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra.');
    }
  };

  return (
    <Modal open={true} sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: 'none',
        border: 'none',
        outline: 0,
        padding: '60px 20px 20px',
        margin: '0 auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{ pr: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <SecurityIcon sx={{ color: '#27ae60' }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>Yêu cầu xác thực 2FA</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            Nhập mã gồm 6 chữ số từ ứng dụng bảo mật của bạn và nhấn <strong>Xác nhận</strong> để tiếp tục.
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='nope'
              label="Nhập mã OTP..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value)}
              error={!!error && !otpToken}
            />

            <Button
              type="button"
              variant="contained"
              color="primary"
              size='large'
              sx={{ textTransform: 'none', minWidth: '120px', height: '55px', fontSize: '1em' }}
              onClick={handleRequire2FA}
            >
              Xác nhận
            </Button>
          </Box>

          <Box>
            <Typography variant="span" sx={{ fontWeight: 'bold', fontSize: '0.9em', color: '#8395a7', '&:hover': { color: '#fdba26' } }}>
              <a style={{ color: 'inherit', textDecoration: 'none' }} href='https://youtube.com/@trungquandev' target='_blank' rel='noreferrer'>
                TrungQuanDev - Một Lập Trình Viên
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default Require2FA;