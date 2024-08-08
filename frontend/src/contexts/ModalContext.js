import { createContext, useState } from 'react';
import Modal from '~/components/Modal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    console.log('ModalProvider', showModal);

    return (
        <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
            {children}
            {showModal && <Modal />}
        </ModalContext.Provider>
    );
};
