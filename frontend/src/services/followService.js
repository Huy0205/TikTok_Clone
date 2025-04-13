import axios from '~/util/axios.customize';

export const checkFollow = async (followerId, followingId) => {
    try {
        const res = await axios.get('/follow/check-follow', { params: { followerId, followingId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const countByFollowing = async (tiktokId) => {
    try {
        const res = await axios.get('/follow/count-by-following', { params: { tiktokId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const countByFollower = async (tiktokId) => {
    try {
        const res = await axios.get('/follow/count-by-follower', { params: { tiktokId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addFollow = async (followingId) => {
    try {
        const res = await axios.post('/follow/add', { followingId });
        console.log(res);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const removeFollow = async (followingId) => {
    try {
        const res = await axios.post('/follow/remove', { followingId });
        console.log('((((((((((((((', res);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
