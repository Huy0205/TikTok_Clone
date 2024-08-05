const { default: axios } = require('~/util/axios.customize');

export const inscreaseKeywordCount = async (keyword) => {
    try {
        const res = await axios.post('/keyword/inscrease-keyword-count', { keyword });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const search = async (keyword) => {
    try {
        const res = await axios.get('/keyword/search', { params: { keyword } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
