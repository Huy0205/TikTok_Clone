import { createContext, useState } from 'react';
import Modal from '~/components/Modal';

export const ModalContext = createContext();

const redirectAfterModalClose = ['/profile', '/upload'];

export const ModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [locationShow, setLocationShow] = useState(null);

    const openModal = (location) => {
        setShowModal(true);
        setLocationShow(location);
    };
    const closeModal = () => {
        if (redirectAfterModalClose.includes(locationShow)) {
            window.location.href = '/';
        }
        setShowModal(false);
    };

    return (
        <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
            {children}
            {showModal && <Modal />}
        </ModalContext.Provider>
    );
};
