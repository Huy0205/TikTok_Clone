import axios from '../util/axios.customize';

export const countLikesByVideoId = async (videoId) => {
    try {
        const res = await axios.get('/like/count-by-videoId', { params: { videoId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const countLikesByPublisherId = async (publisherId) => {
    try {
        const res = await axios.get('/like//count-by-publisherId', { params: { publisherId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addOne = async (like) => {
    try {
        const res = await axios.post('/like/save', like);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteOne = async (likeId) => {
    try {
        const res = await axios.delete('/like/delete', { params: { likeId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
