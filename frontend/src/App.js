import { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import DefaultLayout from '~/layouts';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import Loading from './components/Loading';
import { ToastContainer } from 'react-toastify';

function App() {
    const { setAuth, isLoadingAuth, setIsLoadingAuth } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            const response = await UserServices.getAccount();
            if (response.code === 'TOKEN_EXPIRED' || response.code === 'UNAUTHORIZED') {
                console.log(response.message);
            } else {
                setAuth({
                    isAuthenticated: true,
                    user: response.data,
                });
            }
            setIsLoadingAuth(false);
        };
        fetchAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoadingAuth)
        return (
            <div style={{ height: '100vh' }}>
                <Loading />
            </div>
        );

    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

                    if (route.layout) Layout = route.layout;
                    else if (route.layout === null) Layout = Fragment;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                    <ToastContainer />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
