import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useGlobalContext } from '../../context/globalContext'

const SavingsPieChart = () => {
    const { savings } = useGlobalContext()

    return (
        <div>
            <h3>Thống kê mục tiêu tiết kiệm</h3>
            {savings.length > 0 ? (
                savings.map((saving, index) => {
                    const data = {
                        labels: ['Đã tiết kiệm', 'Còn lại'],
                        datasets: [
                            {
                                data: [saving.currentAmount, saving.targetAmount - saving.currentAmount],
                                backgroundColor: ['#4caf50', '#f44336'],
                                borderWidth: 1,
                            },
                        ],
                    };

                    return (
                        <div key={index} className="savings-chart">
                            <h4>{saving.goal}</h4>
                            <Pie data={data} />
                        </div>
                    );
                })
            ) : (
                <p>Không có mục tiêu tiết kiệm nào.</p>
            )}
        </div>
    );
};

export default SavingsPieChart;