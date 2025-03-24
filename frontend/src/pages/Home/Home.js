import { useContext, useEffect, useState } from 'react';

import { VideoServices } from '~/services';
import { AuthContext, VideoListContext } from '~/contexts';
import VideoList from '~/components/VideoList';
import Loading from '~/components/Loading';

function Home() {
    const [loading, setLoading] = useState(false);

    const { auth, isLoadingAuth } = useContext(AuthContext);
    const { videoList, setVideoList, page, setHasMore, loadedPages, resetVideoListContext } =
        useContext(VideoListContext);

    useEffect(() => {
        return () => {
            resetVideoListContext();
        };
    }, [resetVideoListContext]);

    useEffect(() => {
        if (isLoadingAuth) return;
        if (loadedPages.current.has(page)) return;
        const fetchRecommendedVideos = async () => {
            setLoading(true);
            const res = await VideoServices.recommendedVideos(auth.user.tiktokId, page, 5);
            if (res.code === 'OK') {
                setVideoList((prev) => [...prev, ...res.data]);
                setHasMore(res.data.length > 0);
                loadedPages.current.add(page);
            } else {
                console.error(res.message);
            }
            setLoading(false);
        };

        fetchRecommendedVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div>
            <VideoList data={videoList} />
            {loading && (
                <div style={{ height: 100 }}>
                    <Loading />
                </div>
            )}
        </div>
    );
}

export default Home;
