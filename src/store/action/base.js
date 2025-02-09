import * as TYPES from '../action-types';
import api from '@/api';
const baseAction = {
    async queryUserInfoAsync() {
        let info = null;
        try {
            let { code, data } = await api.queryUserInfo();
            if (+code === 0) {
                info = data;
            }
        } catch (e) { }
        return {
            type: TYPES.BASE_INFO,
            info
        }
    },
    clearUserInfo() {
        return {
            type: TYPES.BASE_INFO,
            info: null
        }
    }
};

export default baseAction;