import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import EditUsernameModal from './EditUsernameModal'
import EditBioModal from './EditBioModal'
import ChangePasswordModal from './ChangePasswordModal'

function Setting() {
    const [showEditModal, setShowEditModal] = useState(false)
    const [showEditBio, setShowEditBio] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [displayName, setdisplayName] = useState('')
    const [bio, setBio] = useState('')

    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/users/${userId}`)
                const user = res.data
                setdisplayName(user.displayName || '')
                setBio(user.bio || '')
            } catch (error) {
                console.error('Lỗi khi lấy thông tin user:', error)
            }
        }

        if (userId) {
            fetchUser()
        }
    }, [userId])

    const handleSaveUsername = (newUsername) => {
        setdisplayName(newUsername)
        setShowEditModal(false)
    }

    const handleSaveBio = (newBio) => {
        setBio(newBio)
        setShowEditBio(false)
    }

    return (
        <SettingStyled>
            {/* phần render giữ nguyên */}
            <div className="setting-container">
                <div className="sidebar">
                    <h2>Cài đặt tài khoản</h2>
                    <p>Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý thông báo, v.v.</p>
                    <button className="active-btn">Thông tin cá nhân</button>
                </div>

                <div className="content">
                    <h2>Thông tin cá nhân</h2>
                    <p>Quản lý thông tin cá nhân của bạn.</p>

                    <div className="section">
                        <h4>Thông tin cơ bản</h4>
                        <p>Quản lý tên hiển thị, tên người dùng, bio và avatar của bạn.</p>

                        <div className="info-box">
                            <div className="info-item clickable" onClick={() => setShowEditModal(true)}>
                                <span className="label">Tên người dùng</span>
                                <span className="value">{displayName || 'Chưa có tên'}</span>
                            </div>
                            <div className="info-item clickable" onClick={() => setShowEditBio(true)}>
                                <span className="label">Giới thiệu</span>
                                <span className="value">{bio || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="info-item clickable" onClick={() => setShowChangePassword(true)}>
                                <span className="label">Đổi mật khẩu</span>
                                <span className="value">********</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditUsernameModal
                    currentUsername={displayName}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUsername}
                />
            )}

            {showEditBio && (
                <EditBioModal
                    currentBio={bio}
                    onClose={() => setShowEditBio(false)}
                    onSave={handleSaveBio}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                />
            )}
        </SettingStyled>
    )
}


const SettingStyled = styled.div`
    width: 100%;
    height: 100%;
    padding: 2rem;

    .setting-container {
        display: flex;
        background: linear-gradient(to right, #fdf6f9, #f0faff);
        border-radius: 20px;
        height: 100%;
        overflow: hidden;
    }

    .sidebar {
        flex: 0.35;
        background: #ffffffb6;
        border-right: 1px solid #eee;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        h2 {
            font-size: 1.5rem;
            color: #222260;
        }

        p {
            color: #555;
            font-size: 0.95rem;
        }

        .active-btn {
            background-color: #222260;
            color: white;
            padding: 0.8rem 1.2rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
        }
    }

    .content {
        flex: 0.65;
        padding: 2rem;

        h2 {
            font-size: 1.5rem;
            color: #222260;
        }

        p {
            color: #555;
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        .section {
            background: white;
            padding: 1.5rem;
            border-radius: 16px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);

            h4 {
                font-size: 1.1rem;
                margin-bottom: 0.3rem;
                color: #333;
            }

            .info-box {
                margin-top: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #eee;
                    padding: 0.8rem 0;

                    .label {
                        font-weight: 500;
                        color: #222;
                    }

                    .value {
                        color: #666;
                    }

                    &.clickable {
                        cursor: pointer;
                        transition: background 0.2s;
                        &:hover {
                            background: #f9f9f9;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .setting-container {
            flex-direction: column;
        }

        .sidebar, .content {
            flex: 1;
            border: none;
        }
    }
`

export default Setting
