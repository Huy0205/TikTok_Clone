import axios from '../util/axios.customize';

export const getNotificationByReceiverId = async (receiverId) => {
    try {
        const res = await axios.get('/notification/receiver', { params: { receiverId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateViewedById = async (id, viewed) => {
    try {
        const res = await axios.put('/notification/update-viewed-by-id', { id, viewed });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
