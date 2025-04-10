import React, { useEffect } from 'react';
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import SavingGoalForm from './SavingForm';
import SavingItem from '../SavingItem/SavingItem';

function Saving() {
    const {
        savings,
        addSaving,
        deleteSaving,
        updateSavingProgress,
        error,
        setError,
    } = useGlobalContext();

    const handleAddSaving = (newSaving) => {
        addSaving(newSaving);
    };


    const handleDeleteSaving = (id) => {
        deleteSaving(id);
    };

    const handleUpdateProgress = (id, newAmount) => {
        updateSavingProgress(id, newAmount);
    };

    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error, setError]);

    return (
        <SavingStyle>
            <div className="">
                <h2>Mục tiêu Tiết kiệm</h2>

                {/* Form to Add New Saving Goal */}
                <SavingGoalForm onAdd={handleAddSaving} />

                {/* Display Existing Saving Goals */}
                <div>
                    {savings.length === 0 ? (
                        <p>Chưa có mục tiêu tiết kiệm nào.</p>
                    ) : (
                        savings.map((saving) => (
                            <SavingItem
                                key={saving.id}
                                id={saving.id}
                                goal={saving.goal}
                                targetAmount={saving.targetAmount}
                                currentAmount={saving.currentAmount}
                                updateProgress={handleUpdateProgress}
                                deleteItem={handleDeleteSaving}
                            />
                        ))
                    )}
                </div>
            </div>
        </SavingStyle>
    );
}


const SavingStyle = styled.div`
    margin: 1rem; 
    padding-top: 1rem;
    h2 {
        font-size: 2rem;
        padding-bottom: 1rem;
    }
`
export default Saving;
