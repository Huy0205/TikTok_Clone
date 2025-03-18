import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: '',
            password: '',
        },
    });
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                isLoadingAuth,
                setIsLoadingAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
