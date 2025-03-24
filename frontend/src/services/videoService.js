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

export const getVideoUserLiked = async (tiktokId, page, limit, sort) => {
    try {
        const res = await axios.get('/video/liked', { params: { tiktokId, page, limit, sort } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVideoUserSaved = async (tiktokId, page, limit, sort) => {
    try {
        const res = await axios.get('/video/saved', { params: { tiktokId, page, limit, sort } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const uploadVideo = async (videoFile) => {
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
        const res = await axios.post('/video/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const saveVideo = async (video) => {
    try {
        const res = await axios.post('/video/add', { ...video });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
