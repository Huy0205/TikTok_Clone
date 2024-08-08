import { Fragment, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import DefaultLayout from '~/layouts';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import Loading from './components/Loading';

function App() {
    const [loading, setLoading] = useState(false);
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        const fetchAccount = async () => {
            const response = await UserServices.getAccount();
            if (response?.data) {
                setAuth({
                    isAuthenticated: true,
                    user: response.data,
                });
            }
            setLoading(false);
        };
        fetchAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loading />;

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
