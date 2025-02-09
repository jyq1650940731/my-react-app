import * as TYPES from "../action-types";
import _ from "@/assets/utils"

const initial = {
    info: undefined
};

const baseReducer = function (state = initial, action) {
    state = _.clone(state);
    switch (action.type) {
        case TYPES.BASE_INFO:
            state.info = action.info;
            break;
        default:
    }
    return state;
};

export default baseReducer;