import axios from '~/util/axios.customize';

export const getAccount = async () => {
    try {
        const res = await axios.get('/user');
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

export const register = async (email, password, tiktokId, birthdate) => {
    try {
        const res = await axios.post('/user/register', { email, password, tiktokId, birthdate });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const login = async (email, password) => {
    try {
        const res = await axios.post('/user/login', { email, password });
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
