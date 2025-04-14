import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';
import moment from 'moment';

function MonthlySummaryChart() {
    const { getMonthlySummary } = useGlobalContext();
    const summaryData = getMonthlySummary();

    const chartData = Object.entries(summaryData)
        .map(([month, data]) => ({
            rawMonth: month,
            displayMonth: moment(month, 'YYYY-MM').isValid() ? dateFormat(month, 'MM/YYYY') : 'Không rõ',
            income: data?.income || 0,
            expense: data?.expense || 0,
            lend: data?.lend || 0,
            borrow: data?.borrow || 0,
        }))
        .sort(
            (a, b) =>
                moment(a.rawMonth, 'YYYY-MM').valueOf() -
                moment(b.rawMonth, 'YYYY-MM').valueOf()
        );
    const formatCurrency = (value) => {
        return `${value.toLocaleString('vi-VN')}đ`;
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '18px' }}>
                Thống Kê Giao Dịch Theo Tháng
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="displayMonth" />
                    <YAxis
                        tickFormatter={formatCurrency}
                        tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                        formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                        labelStyle={{ fontWeight: 'bold', fontSize: 24 }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#4caf50" name="Thu nhập" />
                    <Bar dataKey="expense" fill="#f44336" name="Chi tiêu" />
                    <Bar dataKey="lend" fill="#ff9800" name="Cho vay" />
                    <Bar dataKey="borrow" fill="#9c27b0" name="Nợ vay" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlySummaryChart;
