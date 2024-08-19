import axios from '~/util/axios.customize';

export const checkFollow = async (followingId) => {
    try {
        const res = await axios.post(`/follow/${followingId}`);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const countFollowOfUser = async (tiktokId) => {
    try {
        const res = await axios.get('/follow/countOfUser', { params: { tiktokId } });
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
