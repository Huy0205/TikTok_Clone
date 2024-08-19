import { useContext, useEffect, useState, useRef, useCallback } from 'react';

import { VideoServices } from '~/services';
import { AuthContext } from '~/contexts';
import VideoList from '~/components/VideoList';
import Loading from '~/components/Loading';

function Home() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { auth } = useContext(AuthContext);

    const observer = useRef();
    const lastVideoElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore],
    );

    useEffect(() => {
        setLoading(true);
        const fetchRecommendedVideos = async () => {
            const res = await VideoServices.recommendedVideos(auth.user.tiktokId, page, 10);
            if (res.code === 'OK') {
                setData((prev) => [...prev, ...res.data]);
                setHasMore(res.data.length > 0);
                setLoading(false);
            } else {
                console.error(res.message);
            }
        };

        fetchRecommendedVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div>
            <VideoList data={data} lastVideoElementRef={lastVideoElementRef} />
            {loading && (
                <div style={{ height: 100 }}>
                    <Loading />
                </div>
            )}
        </div>
    );
}

export default Home;
