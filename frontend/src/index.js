import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';
import { AuthProvider, ModalProvider } from './contexts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <GlobalStyles>
                <ModalProvider>
                    <App />
                </ModalProvider>
            </GlobalStyles>
        </AuthProvider>
    </React.StrictMode>,
);
