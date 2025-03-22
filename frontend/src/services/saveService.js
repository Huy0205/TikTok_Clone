import axios from '../util/axios.customize';

export const countSavesByVideoId = async (videoId) => {
    try {
        const res = await axios.get('/save/count-by-videoId', { params: { videoId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addOne = async (save) => {
    try {
        const res = await axios.post('/save/add', save);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteOne = async (saveId) => {
    try {
        const res = await axios.delete('/save/delete', { params: { saveId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
