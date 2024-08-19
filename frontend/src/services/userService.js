import axios from '~/util/axios.customize';

export const getAccount = async () => {
    try {
        const res = await axios.get('/user/auth');
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserByTiktokId = async (tiktokId) => {
    try {
        const res = await axios.get('/user', { params: { tiktokId } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const sendOTPByMail = async (email) => {
    try {
        const res = await axios.post('/user/send-otp-mail', { email });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const res = await axios.post('/user/verify-otp', { email, otp });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const register = async (formData) => {
    try {
        const res = await axios.post('/user/register', { formData });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const login = async (formData) => {
    try {
        const res = await axios.post('/user/login', { formData });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const search = async (currentTiktokId, keyword, page, limit) => {
    try {
        const res = await axios.get('/user/search', { params: { currentTiktokId, keyword, page, limit } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserByFollowings = async (page, limit) => {
    try {
        const res = await axios.get('/user/followings', { params: { page, limit } });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};
