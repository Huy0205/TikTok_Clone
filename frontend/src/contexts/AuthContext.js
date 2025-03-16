import { createContext, useEffect, useState } from 'react';

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

    useEffect(() => {
        if (auth.isAuthenticated) {
            setIsLoadingAuth(false);
        }
    }, [auth.isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                isLoadingAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
