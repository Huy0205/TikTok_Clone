import Videos from '~/components/VideoList';
import video1 from '~/assets/video/test.mp4';
import video2 from '~/assets/video/test2.mp4';
import video3 from '~/assets/video/test3.mp4';

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
        id: 2,
        src: video2,
        title: 'Video 2',
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
];

function Home() {
    return (
        <div>
            <Videos data={fakeData} />
        </div>
    );
}

export default Home;
