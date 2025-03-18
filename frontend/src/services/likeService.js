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

export const saveLike = async (like) => {
    console.log(like);
    try {
        const res = await axios.post('/like/save', like);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteLike = async (likeId) => {
    try {
        const res = await axios.delete('/like/delete', { params: { likeId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
