import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '../../Components/Loading/PageLoadingSpinner'
import { useGlobalContext } from '../../context/globalContext'

function AccountVerification() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  const { verifyUserAPI, user } = useGlobalContext()
  const [status, setStatus] = useState({
    loading: true,
    error: false
  })

  useEffect(() => {
    if (!email || !token) {
      setStatus({ loading: false, error: true })
      return
    }

    verifyUserAPI({ email, token })
      .then(() => setStatus({ loading: false, error: false }))
      .catch(() => setStatus({ loading: false, error: true }))
  }, [email, token, verifyUserAPI])

  // Nếu email hoặc token không hợp lệ, hoặc có lỗi, chuyển hướng đến trang 404
  if (!email || !token || status.error) {
    return <Navigate to="/404" />
  }

  // Nếu đang trong quá trình xác minh, hiển thị loading spinner
  if (status.loading) {
    return <PageLoadingSpinner caption="Đang xác minh tài khoản..." />
  }

  // Nếu người dùng đã xác minh và có thông tin user, chuyển hướng tới dashboard
  if (user?.isActive) {
    return <Navigate to="/dashboard" />
  }

  // Nếu người dùng không xác minh, chuyển hướng về trang login
  return <Navigate to={`/login?verifiedEmail=${encodeURIComponent(email)}`} />
}

export default AccountVerification
