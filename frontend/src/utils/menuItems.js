import {dashboard, expenses, trend, handDollar} from '../utils/Icons'

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
        title: "Nợ",
        icon: handDollar,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Tiết kiệm",
        icon: handDollar,
        link: "/dashboard",
    },
]