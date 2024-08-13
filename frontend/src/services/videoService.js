import axios from '~/util/axios.customize';

export const recommendedVideos = async (currentTiktokId, page, limit) => {
    try {
        const res = await axios.get('/video/recommend', { params: { currentTiktokId, page, limit } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
