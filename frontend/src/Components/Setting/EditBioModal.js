import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'

const EditBioModal = ({ currentBio, onClose, onSave }) => {
  const [bio, setBio] = useState(currentBio || '')
  const { user, updateUser } = useGlobalContext()

  const handleSave = async () => {
    try {
      await updateUser({ userId: user?._id, bio })
      onSave(bio)
      onClose()
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật giới thiệu')
    }
  }

  return (
    <Overlay>
      <CloseButton onClick={onClose}>×</CloseButton>
      <ModalBox>
        <div className="header">
          <h2>Chỉnh sửa giới thiệu</h2>
        </div>
        <p className="description">
          Viết một đoạn mô tả ngắn gọn về bản thân bạn. Nội dung sẽ hiển thị trên trang cá nhân.
        </p>
        <label className="input-label">Giới thiệu</label>
        <textarea 
          className="input textarea"
          rows="5"
          maxLength="200"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <p className="char-count">{bio.length}/200 ký tự</p>
        <button className="save-btn" onClick={handleSave}>Lưu lại</button>
      </ModalBox>
    </Overlay>
  )
}

export default EditBioModal

const Overlay = styled.div`
  position: fixed;
  top: 0; left: -200px;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalBox = styled.div`
  background: linear-gradient(135deg, #fff, #e6f7ff);
  padding: 2rem;
  border-radius: 16px;
  width: 450px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 1.4rem;
      margin: 0;
    }

  }

  .description {
    font-size: 0.9rem;
    margin: 1rem 0;
    color: #555;
  }

  .input-label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
    color: #333;
  }

  .input {
    width: 100%;
    padding: 0.7rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 1rem;
    resize: none;
  }

  .char-count {
    font-size: 0.8rem;
    text-align: right;
    margin-top: 4px;
    color: #777;
  }

  .save-btn {
    width: 100%;
    padding: 0.8rem;
    margin-top: 1rem;
    background: linear-gradient(90deg, #9be7ff, #5fd2c9);
    border: none;
    border-radius: 20px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.3s ease;
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

