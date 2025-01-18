import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ totalLoaned, totalBorrowed }) => {
    const data = {
        labels: ['Nợ vay', 'Nợ cho vay'],
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
            <h3>Thống kê vay, nợ</h3>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
