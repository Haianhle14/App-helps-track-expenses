import React from 'react';
import styled from 'styled-components';

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <ModalOverlay>
            <ModalBox>
                <p>{message}</p>
                <div className="buttons">
                    <button className="confirm" onClick={onConfirm}>Có</button>
                    <button className="cancel" onClick={onCancel}>Không</button>
                </div>
            </ModalBox>
        </ModalOverlay>
    );
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

    p {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;

        button {
            padding: 0.5rem 1.2rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        .confirm {
            background-color: var(--color-delete);
            color: white;
        }

        .cancel {
            background-color: #ccc;
            color: black;
        }
    }
`;

export default ConfirmModal;
