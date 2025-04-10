import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'

const EditUsernameModal = ({ currentDisplayName, onClose, onSave }) => {
    const [newDisplayName, setNewDisplayName] = useState(currentDisplayName || '')
    const { user, updateUser } = useGlobalContext()
  
    const handleSave = async () => {
      try {
        await updateUser({ userId: user?._id, displayName: newDisplayName })
        onSave(newDisplayName)
        onClose()
      } catch (err) {
        alert(err.message || 'Lỗi khi cập nhật tên hiển thị')
      }
    }
  
    return (
      <ModalOverlay>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalContainer>
          <h2>Chỉnh sửa tên hiển thị</h2>
          <p>
            URL trang cá nhân của bạn sẽ bị thay đổi, bạn cũng sẽ không sử dụng được tên cũ để đăng nhập vào hệ thống.
          </p>
          <label htmlFor="displayName">Tên hiển thị</label>
          <input
            id="displayName"
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          <div className="url-preview">
            URL: https://example.com/{newDisplayName || 'ten-hien-thi'}
          </div>
          <button onClick={handleSave}>Lưu lại</button>
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
    max-width: 500px;
    max-height: 90vh; /* Giới hạn chiều cao modal */
    overflow-y: auto; /* Thêm thanh cuộn khi nội dung vượt quá */
    padding: 2rem;
    border-radius: 16px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease;

    h2 {
        margin-top: 0;
        color: #222260;
    }

    p {
        font-size: 0.95rem;
        color: #555;
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin: 0.5rem 0 0.3rem;
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

    .url-preview {
        font-size: 0.9rem;
        margin-bottom: 1rem;
        color: #666;
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
            /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
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
`


export default EditUsernameModal
