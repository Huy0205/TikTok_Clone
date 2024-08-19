import axios from '~/util/axios.customize';

export const recommendedVideos = async (currentTiktokId, page, limit) => {
    try {
        const res = await axios.get('/video/recommended', { params: { currentTiktokId, page, limit } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVideoByFollowing = async (page, limit) => {
    try {
        const res = await axios.get('/video/following', { params: { page, limit } });
        
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVideoByPublisherId = async (publisherId, page, limit, sort) => {
    try {
        const res = await axios.get('/video/publisher', { params: { publisherId, page, limit, sort } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVideoUserLiked = async (userId, page, limit, sort) => {
    try {
        const res = await axios.get('/video/liked', { params: { userId, page, limit, sort } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
