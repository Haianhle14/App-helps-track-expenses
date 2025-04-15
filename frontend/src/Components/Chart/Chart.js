import React from 'react'
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)
function Chart() {
    const { incomes, expenses } = useGlobalContext();

    // Hàm định dạng thành "MM/YYYY"
    const getMonthYear = (date) => {
        const d = new Date(date);
        const month = d.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${month.toString().padStart(2, '0')}/${year}`;
    }

    // Gom dữ liệu theo tháng
    const groupByMonth = (data) => {
        return data.reduce((acc, curr) => {
            const month = getMonthYear(curr.date);
            if (!acc[month]) acc[month] = 0;
            acc[month] += curr.amount;
            return acc;
        }, {});
    }

    const incomeByMonth = groupByMonth(incomes);
    const expenseByMonth = groupByMonth(expenses);

    // Lấy danh sách các tháng, sau đó sắp xếp
    const allMonths = Array.from(new Set([
        ...Object.keys(incomeByMonth),
        ...Object.keys(expenseByMonth)
    ])).sort((a, b) => {
        const [ma, ya] = a.split('/').map(Number);
        const [mb, yb] = b.split('/').map(Number);
        return ya - yb || ma - mb;
    });

    const data = {
        labels: allMonths,
        datasets: [
            {
                label: 'Thu Nhập',
                data: allMonths.map(month => incomeByMonth[month] || 0),
                backgroundColor: 'green',
                borderColor: 'green',
                tension: 0.2,
                fill: false,
            },
            {
                label: 'Chi Tiêu',
                data: allMonths.map(month => expenseByMonth[month] || 0),
                backgroundColor: 'red',
                borderColor: 'red',
                tension: 0.2,
                fill: false,
            }
        ]
    }

    return (
        <ChartStyled>
            <Line data={data} />
        </ChartStyled>
    )
}


const ChartStyled = styled.div`
    display: grid;
    place-items: center;
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    width: 100%;
    
`;

export default Chart