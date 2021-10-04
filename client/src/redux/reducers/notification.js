import { NEW_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants';
const initialState = [];

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case NEW_NOTIFICATION:
            return [...state, payload];
        case REMOVE_NOTIFICATION:
            return state.filter(notification => notification.room != payload.id);// remove all the notification related to the room

        default:
            return state;
    }
}