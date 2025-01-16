import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ totalLoaned, totalBorrowed }) => {
    const data = {
        labels: ['Nợ cho vay', 'Nợ vay'],
        datasets: [
            {
                label: 'Thống kê nợ',
                data: [totalLoaned, totalBorrowed],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div>
            <h3>Thống kê nợ</h3>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
