import { Link, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '../../utils/validators'

function LoginForm({ onLoginSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  // Hiển thị thông báo nếu email đã được xác minh
  if (verifiedEmail) {
    toast.success(`Email ${verifiedEmail} đã được xác minh. Bạn có thể đăng nhập!`, { autoClose: 5000 })
  }

  // Hiển thị thông báo nếu email cần xác minh trước khi đăng nhập
  if (registeredEmail) {
    toast.info(`Một email xác minh đã được gửi đến ${registeredEmail}. Kiểm tra và xác minh trước khi đăng nhập.`, { autoClose: 5000 })
  }

  // Hàm submit có gọi API login và lưu vào localStorage
  const submitLogIn = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', data)
      const { accessToken, _id, isActive } = response.data
  
      // Lưu vào localStorage
      localStorage.setItem('userId', _id)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('isActive', isActive)
  
      toast.success('Đăng nhập thành công!')
      
      // Gọi callback để chuyển sang dashboard
      onLoginSuccess()
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!')
      console.error(error)
    }
  }
    
  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 480, maxWidth: 480, marginTop: '6em' }}>
          <Box sx={{ color: '#222260', fontSize: '24px', margin: '1em', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <h2>Đăng nhập vào website</h2>
          </Box>

          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                autoComplete="current-password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
            </Box>
          </Box>

          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Đăng Nhập
            </Button>
          </CardActions>

          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Bạn chưa có tài khoản?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Đăng ký ngay!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm