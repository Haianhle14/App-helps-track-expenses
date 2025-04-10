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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [active, setActive] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const navigate = useNavigate()
  const location = useLocation()

  const orbMemo = useMemo(() => <Orb />, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    navigate('/dashboard');
  };
  
  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    navigate('/dashboard');
  };

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

  if (!isAuthenticated) {
    return (
      <AppStyled bg={bg}>
        {orbMemo}
        <MainLayout>
          <main>
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
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
        setIsAuthenticated={setIsAuthenticated}
      />
        <main key={location.pathname}>
          <Routes>
            <Route path="/dashboard" element={displayData()} />
            <Route path="/income" element={displayData()} />
            <Route path="/expenses" element={displayData()} />
            <Route path="/debts" element={displayData()} />
            <Route path="/save" element={displayData()} />
            <Route path="/setting" element={displayData()} />
            <Route path="*" element={<Navigate to="" />} />
          </Routes>
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
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`

export default App
