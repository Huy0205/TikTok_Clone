import VideoList from '~/components/VideoList';
import video1 from '~/assets/video/test.mp4';
import video2 from '~/assets/video/test2.mp4';
import video3 from '~/assets/video/test3.mp4';

import { VideoServices } from '~/services';
import { useContext, useEffect } from 'react';
import { AuthContext } from '~/contexts';

const fakeData = [
    {
        id: 1,
        src: video1,
        title: 'Video 1',
        author: 'John Doe',
        likes: 10,
        comments: 3,
        shares: 5,
    },
    {
        id: 3,
        src: video3,
        title: 'Video 3',
        author: 'John Doe',
        likes: 10,
        comments: 3,
        shares: 5,
    },
    {
        id: 2,
        src: video2,
        title: 'Video 2',
        author: 'John Doe',
        likes: 10,
        comments: 3,
        shares: 5,
    },
    {
        id: 4,
        src: 'https://res.cloudinary.com/dpdymg8vm/video/upload/v1723190829/TikTok_Clone/f16uescq7cidntprtf0w.mp4',
        title: 'Video 4',
        author: 'John Doe',
        likes: 10,
        comments: 3,
        shares: 5,
    },
];

function Home() {
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchRecommendedVideos = async () => {
            const res = await VideoServices.recommendedVideos(auth.user.tiktokId, 1, 10);
            console.log(res);
        };

        fetchRecommendedVideos();
    }, []);

    return (
        <div>
            <VideoList data={fakeData} />
        </div>
    );
}

export default Home;
