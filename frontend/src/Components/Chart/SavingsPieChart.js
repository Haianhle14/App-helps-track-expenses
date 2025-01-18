import React from 'react';
import { Pie } from 'react-chartjs-2';

const SavingsPieChart = ({ totalCurrent, totalTarget }) => {
    const data = {
        labels: ['Đã tiết kiệm', 'Còn lại'],
        datasets: [
            {
                data: [totalCurrent, totalTarget - totalCurrent],
                backgroundColor: ['#4caf50', '#f44336'],
                borderWidth: 1,
            },
        ],
    };


    return (
        <div>
            <h3> Thống kê mục tiêu tiết kiệm</h3>
            <Pie data={data}/>
        </div>
    );
};

export default SavingsPieChart;
