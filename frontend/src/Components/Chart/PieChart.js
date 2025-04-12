import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ totalLoaned, totalBorrowed }) => {
    const data = {
        labels: ['Vay', 'Cho Vay'],
        datasets: [
            {
                label: 'Thống Kê Vay Và Cho Vay',
                data: [totalLoaned, totalBorrowed],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div>
            <h3>Thống kê vay và cho vay</h3>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
