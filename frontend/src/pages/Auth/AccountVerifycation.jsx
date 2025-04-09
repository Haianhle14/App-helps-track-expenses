import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import PageLoadingSpinner from '../../components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '../../apis'

function AccountVerifycation() {
  let [searchParams] = useSearchParams()

  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => {
          setVerified(true)
        })
        .catch(() => {
          setVerified(false)
        })
    }
  }, [email, token])
  if (!email || !token) {
    return <Navigate to="/404"></Navigate>
  }

  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..."/>
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerifycation