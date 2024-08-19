import { useContext, useEffect, useState } from 'react';
import VideoList from '~/components/VideoList';
import { AuthContext } from '~/contexts';

import { VideoServices } from '~/services';

function Following() {
    const [data, setData] = useState([]);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchVideosByFollowing = async () => {
            if (auth.isAuthenticated) {
                const res = await VideoServices.getVideoByFollowing(1, 10);
                if (res.code === 'OK') {
                    setData((prevData) => [...prevData, ...res.data]);
                }
            }
        };
        fetchVideosByFollowing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {auth.isAuthenticated ? (
                <div>
                    <VideoList data={data} />
                </div>
            ) : (
                <div>
                    <h1>Following</h1>
                </div>
            )}
        </>
    );
}

export default Following;
