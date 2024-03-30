import React, { useEffect } from 'react';
import './Modal.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (isOpen) {
            timerId = setTimeout(() => {
                onClose();
            }, 1500);
        }

        return () => clearTimeout(timerId);
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}></span>
                        <p>Заполните информацию о Task</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;
