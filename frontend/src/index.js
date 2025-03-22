import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';
import { AuthProvider, ModalProvider, SocketProvider } from './contexts';
import { VideoProvider } from './contexts/VideoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <AuthProvider>
        <SocketProvider>
            <GlobalStyles>
                <VideoProvider>
                    <ModalProvider>
                        <App />
                    </ModalProvider>
                </VideoProvider>
            </GlobalStyles>
        </SocketProvider>
    </AuthProvider>,
    // </React.StrictMode>,
);
