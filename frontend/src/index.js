import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';
import { AuthProvider, ModalProvider, SocketProvider, VideoListProvider } from './contexts';
import { VideoProvider } from './contexts/VideoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <AuthProvider>
        <SocketProvider>
            <GlobalStyles>
                <VideoListProvider>
                    <VideoProvider>
                        <ModalProvider>
                            <App />
                        </ModalProvider>
                    </VideoProvider>
                </VideoListProvider>
            </GlobalStyles>
        </SocketProvider>
    </AuthProvider>,
    // </React.StrictMode>,
);
