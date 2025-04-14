import React, { useState, useMemo } from 'react'
import styled from "styled-components"
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import bg from './img/bg.png'
import { MainLayout } from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard'
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses'
import Debts from './Components/Debts/Debts'
import Save from './Components/Save/Savings'
import Login from './pages/Auth/LoginForm'
import Register from './pages/Auth/RegisterForm'
import Setting from './Components/Setting/Setting'
import Require2FA from './pages/Auth/require-2fa'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccountVerification from './pages/Auth/AccountVerifycation'

function App() {
  const [active, setActive] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  )
  const [show2FA, setShow2FA] = useState(false)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  const orbMemo = useMemo(() => <Orb />, [])

  const handleLoginSuccess = ({ require_2fa, user }) => {
    if (require_2fa) {
      setShow2FA(true)
      setUser(user)
    } else {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      navigate('/dashboard')
    }
  }
  
  const handleRegisterSuccess = () => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
    navigate('/dashboard')
  }

  const handleSuccessVerify2FA = (updatedUser) => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
    setShow2FA(false)
    setUser(updatedUser)
    navigate('/dashboard')
  }

  const displayData = () => {
    switch (active) {
      case 1: return <Dashboard />
      case 2: return <Income />
      case 3: return <Expenses />
      case 4: return <Debts />
      case 5: return <Save />
      case 6: return <Setting />
      default: return <Dashboard />
    }
  }

  // Nếu chưa xác thực: login/register
  if (!isAuthenticated) {
    return (
      <AppStyled bg={bg}>
        <ToastContainer position="bottom-right" autoClose={3000} />
        {orbMemo}
        <MainLayout>
          <main>
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="/account/verification" element={
              <AccountVerification 
                setIsAuthenticated={setIsAuthenticated} 
                setUser={setUser}
              />
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
            {/* Hiện modal 2FA nếu cần */}
            {show2FA && user && (
              <Require2FA
                user={user}
                handleSuccessVerify2FA={handleSuccessVerify2FA}
              />
            )}
          </main>
        </MainLayout>
      </AppStyled>
    )
  }

  return (
    <AppStyled bg={bg}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {orbMemo}
      <MainLayout>
        <Navigation 
          active={active} 
          setActive={setActive} 
          setIsAuthenticated={(val) => {
            setIsAuthenticated(val)
            if (!val) {
              localStorage.removeItem("isAuthenticated")
              navigate("/login")
            }
          }}
        />
        <main key={location.pathname}>
          <Routes>
            <Route path="/dashboard" element={displayData()} />
            <Route path="/income" element={displayData()} />
            <Route path="/expenses" element={displayData()} />
            <Route path="/debts" element={displayData()} />
            <Route path="/save" element={displayData()} />
            <Route path="/setting" element={displayData()} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>

          {/* Hiện modal 2FA nếu cần */}
          {show2FA && user && (
            <Require2FA
              user={user}
              handleSuccessVerify2FA={handleSuccessVerify2FA}
            />
          )}
        </main>

      </MainLayout>
    </AppStyled>
  )
}

const AppStyled = styled.div`
height: 100vh;
background-image: url(${props => props.bg});
position: relative;

main {
  flex: 1;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 2rem;

  overflow-x: auto;   /* Hiện thanh cuộn ngang nếu tràn */
  overflow-y: auto;   /* Hiện thanh cuộn dọc nếu tràn */

  /* Optional: hiện thanh cuộn tùy chỉnh */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
`;


export default App
