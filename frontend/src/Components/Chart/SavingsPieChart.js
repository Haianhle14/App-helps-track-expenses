import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useGlobalContext } from '../../context/globalContext';
import styled from 'styled-components';

const SavingsPieChart = () => {
    const { savings } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    // Sắp xếp dữ liệu tiết kiệm theo thời gian (mới nhất lên trước)
    const sortedSavings = [...savings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedSavings.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(savings.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <SavingsPieChartStyled>
            <div>
                <h3>Thống kê mục tiêu tiết kiệm</h3>
                {currentItems.length > 0 ? (
                    currentItems.map((saving, index) => {
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

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </SavingsPieChartStyled>
    );
};

const SavingsPieChartStyled = styled.div`
    width: 100%;

    .savings-chart {
        margin-bottom: 20px;
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        gap: 0.5rem;

        button {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 0.3rem 0.8rem;
            cursor: pointer;
            transition: background 0.3s ease;

            &.active {
                background-color: var(--color-green);
                color: white;
                font-weight: bold;
            }

            &:hover {
                background-color: #f0f0f0;
            }
        }
    }
`;

export default SavingsPieChart;
