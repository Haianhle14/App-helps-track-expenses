import {dashboard, expenses, trend, handshake, clipboard, settings} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Trang chủ',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "Thu Nhập",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Chi Tiêu",
        icon: expenses,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Vay Và Cho Vay",
        icon: handshake,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Mục Tiêu Tiết Tiệm",
        icon: clipboard,
        link: "/dashboard",
    },
    {
        id: 6,
        title: "Cài Đặt",
        icon: settings,
        link: "/setting"
    }
]