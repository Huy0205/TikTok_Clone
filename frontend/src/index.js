import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';
import AuthProvider from '~/contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </AuthProvider>
    </React.StrictMode>,
);
