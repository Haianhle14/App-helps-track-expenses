import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ totalLoaned, totalBorrowed }) => {
    const data = {
        labels: ['Vay', 'Cho Vay'],
        datasets: [
            {
                data: [totalLoaned, totalBorrowed],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toLocaleString('vi-VN')}đ`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h3>Thống kê tổng vay và cho vay</h3>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
