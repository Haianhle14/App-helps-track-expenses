import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '../../utils/validators'
import { registerUserAPI } from '../../apis'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const submitRegister = async (data) => {
    const { email, password } = data
    try {
      toast.info('⏳ Đang xử lý đăng ký...', { autoClose: 2000 })
      const user = await registerUserAPI({ email, password })
      toast.success('🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác minh.', { autoClose: 5000 })
      navigate(`/login?registeredEmail=${user.email}`)
    } catch (error) {
      console.error('🚨 Lỗi đăng ký:', error)
  
      let errMsg = '❌ Đăng ký thất bại. Vui lòng thử lại!'
      // Nếu có lỗi chi tiết từ backend (ví dụ: lỗi từ Joi, email đã tồn tại, lỗi mạng...)
      if (error?.response?.data?.message) {
        errMsg = error.response.data.message
      } else if (error?.message) {
        errMsg = error.message
      }
  
      toast.error(errMsg, { autoClose: 5000 })
    }
  }
  
  return (
    <form
      onSubmit={handleSubmit(
        submitRegister,
        () => {
          toast.warning('⚠️ Vui lòng kiểm tra lại thông tin đăng ký.', { autoClose: 3000 })
        }
      )}
    >
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            color: '#222260',
            fontSize: '24px',
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <h2>Đăng Ký</h2>
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
                helperText={errors['email']?.message}
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
                variant="outlined"
                error={!!errors['password']}
                helperText={errors['password']?.message}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
            </Box>

            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                variant="outlined"
                error={!!errors['password_confirmation']}
                helperText={errors['password_confirmation']?.message}
                {...register('password_confirmation', {
                  validate: (value) => {
                    const matched = value === watch('password')
                    if (!matched) {
                      toast.warning('⚠️ Xác nhận mật khẩu không khớp!!', { autoClose: 3000 })
                    }
                    return matched || 'Xác nhận mật khẩu không khớp!!'
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
              Đăng Ký
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Bạn đã có tài khoản?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Đăng nhập</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
