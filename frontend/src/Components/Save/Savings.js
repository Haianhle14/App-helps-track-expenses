import React, { useEffect } from 'react';
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

    // Handle Add Saving
    const handleAddSaving = (newSaving) => {
        addSaving(newSaving);
    };

    // Handle Delete Saving
    const handleDeleteSaving = (id) => {
        deleteSaving(id);
    };

    // Handle Update Saving Progress
    const handleUpdateProgress = (id, newAmount) => {
        updateSavingProgress(id, newAmount);
    };

    // Display Error Message
    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error, setError]);

    return (
        <div>
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
    );
}

export default Saving;
