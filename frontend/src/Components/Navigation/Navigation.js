import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import avatar from '../../img/avatar.jpg'
import { signout } from '../../utils/Icons'
import { menuItems } from '../../utils/menuItems'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/globalContext'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/v1/'

function Navigation({ active, setActive, setIsAuthenticated, openProfilePanel  }) {
    const navigate = useNavigate()
    const { user, logout } = useGlobalContext()
    const [localUser, setLocalUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        if (!user) {
            const userId = localStorage.getItem('userId')
            if (userId) {
                axios.get(`${BASE_URL}users/${userId}`)
                    .then(res => setLocalUser(res.data))
                    .catch(err => console.error('Lỗi lấy user:', err))
            }
        } else {
            setLocalUser(user)
        }
    }, [user])

    const handleMenuClick = (item) => {
        setActive(item.id)
        navigate(item.link)
    }

    const handleLogout = () => {
        logout()
        setIsAuthenticated(false)
        navigate('/login')
    }

    const displayUser = user || localUser
    
    return (
        <NavStyled>
            <div className="user-con" onClick={() => setShowDropdown(!showDropdown)}>
                <img src={displayUser?.avatar || avatar} alt="avatar" />
                <div className="text">
                    <h2>{displayUser?.displayName || 'Khách'}</h2>
                </div>
            </div>

            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => handleMenuClick(item)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>

            <ul className="bottom-nav">
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    {signout} Đăng Xuất
                </li>
            </ul>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        position: relative;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #ffffff;
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            padding-left: 1rem;
            position: relative;

            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all 0.4s ease-in-out;
            }
        }
    }

    .active {
        color: rgba(34, 34, 96, 1) !important;

        i {
            color: rgba(34, 34, 96, 1) !important;
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #c0392b;
        font-weight: 500;
    }
`

export default Navigation
