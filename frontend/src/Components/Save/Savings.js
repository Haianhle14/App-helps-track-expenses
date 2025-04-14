import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import SavingGoalForm from './SavingForm'
import SavingItem from '../SavingItem/SavingItem'

function Saving() {
    const {
        savings,
        addSaving,
        deleteSaving,
        updateSavingProgress,
        getSavings,
        error,
        setError,
    } = useGlobalContext()
    
    useEffect(() => {
        getSavings()
    }, [getSavings])

    useEffect(() => {
        if (error) {
            alert(error)
            setError(null)
        }
    }, [error, setError])

    return (
        <SavingStyle>
            <h1>Mục Tiêu Tiết kiệm</h1>

            {/* Form thêm mục tiêu */}
            <SavingGoalForm onAdd={addSaving} />

            {/* Kiểm tra danh sách */}
            <div>
                {savings && savings.length > 0 ? (
                    savings.map((saving, index) => {
                        return (
                            <SavingItem
                                key={saving._id || saving.id} 
                                _id={saving._id || saving.id} 
                                goal={saving.goal}
                                targetAmount={saving.targetAmount}
                                currentAmount={saving.currentAmount}
                                updateProgress={updateSavingProgress}
                                deleteItem={deleteSaving}
                            />
                        )
                    })
                ) : (
                    <p>Chưa có mục tiêu tiết kiệm nào.</p>
                )}
            </div>
        </SavingStyle>
    )
}

const SavingStyle = styled.div`
    max-width: 900px;
    margin: 0 auto;

    h1 {
        font-size: 2.5rem;
        text-align: center;
    }
`;


export default Saving;
