import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { toast } from 'react-toastify'

function ChangePasswordModal({ onClose }) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { changePassword } = useGlobalContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận không khớp')
            return
        }

        try {
            const resMessage = await changePassword(currentPassword, newPassword)
            toast.success(resMessage || 'Đổi mật khẩu thành công!')
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            toast.error(error.message || 'Đã có lỗi xảy ra')
        }
    }

    return (
        <ModalOverlay>
            <CloseButton onClick={onClose}>×</CloseButton>
            <ModalContainer>
                <h2>Đổi mật khẩu</h2>
                
                <Form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <SubmitButton type="submit">Xác nhận</SubmitButton>
                </Form>
            </ModalContainer>
        </ModalOverlay>
    )
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
`

const ModalContainer = styled.div`
    background: white;
    width: 90%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 16px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease;

    h2 {
        margin-top: 0;
        color: #222260;
        text-align: center;
        font-size: 1.3rem;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    
    input {
        width: 100%;
        padding: 0.6rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 0.5rem 0;
        font-size: 1rem;
    }
`

const SubmitButton = styled.button`
    background: linear-gradient(to right, #6dd5ed, #2193b0);
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
    transition: transform 0.2s, opacity 0.2s;

    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`

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
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`

export default ChangePasswordModal