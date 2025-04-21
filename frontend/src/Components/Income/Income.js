import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { InnerLayout } from '../../styles/Layouts'
import Form from '../Form/Form'
import IncomeItem from '../IncomeItem/IncomeItem'
import { toast } from 'react-toastify'

function Income() {
    const { incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    useEffect(() => {
        getIncomes()
    }, [getIncomes])

    // Tính toán phân trang
    const sortedIncomes = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date))
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedIncomes.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(incomes.length / itemsPerPage)
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Quản Lý Thu Nhập</h1>
                <h2 className="total-income">
                    Tổng thu nhập: <span>{Number(totalIncome()).toLocaleString('vi-VN')}đ</span>
                </h2>
                <div className="income-content">
                    <div className="form-container">
                        <Form onSuccess={() => toast.success('Thêm thu nhập thành công!')} />
                    </div>
                    <div className="incomes">
                        {currentItems.map((income) => {
                            const { _id, title, amount, date, category, description, type } = income
                            return <IncomeItem
                                key={_id}
                                id={_id}
                                title={title}
                                description={description}
                                amount={amount}
                                date={date}
                                type={type}
                                category={category}
                                indicatorColor="var(--color-green)"
                                deleteItem={deleteIncome}
                            />
                        })}
                        {/* PHÂN TRANG */}
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
                </div>
            </InnerLayout>
        </IncomeStyled>
    )
}

const IncomeStyled = styled.div`
    width: 100%;
    overflow-x: hidden;

    h1 {
        font-size: 2.5rem;
        text-align: center;
    }

    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;

        .form-container {
            flex: 1;
            min-width: 300px;
        }

        .incomes {
            flex: 2;
            min-width: 0;
        }
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

export default Income
