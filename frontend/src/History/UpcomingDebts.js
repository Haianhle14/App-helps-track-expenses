import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/globalContext';

const UpcomingDebts = () => {
    const { getUpcomingDebtsReminder } = useGlobalContext();
    const [upcomingDebts, setUpcomingDebts] = useState([]);

    useEffect(() => {
        const reminders = getUpcomingDebtsReminder(7); // 7 ngày tới
        setUpcomingDebts(reminders);
    }, [getUpcomingDebtsReminder]);

    if (upcomingDebts.length === 0) return null;

    return (
        <div className="bg-white shadow-lg p-6 mt-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-red-600">🔔 Nợ sắp đến hạn</h2>
            <ul className="space-y-4">
                {upcomingDebts.map(debt => (
                    <li key={debt._id} className="border-b pb-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                            <div className="flex flex-col">
                                <h5 className="text-sm text-gray-600">
                                    {debt.type === 'borrow'
                                        ? `Vay từ ${debt.lender || 'Không rõ'}`
                                        : `Cho ${debt.borrower || 'Không rõ'} vay`}
                                </h5>
                                <p className="text-sm text-gray-400">
                                    {debt.type === 'borrow'
                                        ? 'Bạn cần trả'
                                        : 'Người khác nợ bạn'}: {debt.amount.toLocaleString()}₫
                                </p>
                            </div>
                            <span className="text-sm text-red-400 whitespace-nowrap">
                                Đến hạn: {new Date(debt.dueDate).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingDebts;
