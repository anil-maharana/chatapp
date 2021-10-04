import { v4 as uuidv4 } from 'uuid';
import { NEW_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants';

export const newNotification = (message, room) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: NEW_NOTIFICATION,
        payload: { message, room, id }
    })
}
export const removeNotification = (id) => dispatch => {
    dispatch({
        type: REMOVE_NOTIFICATION,
        payload: { id }
    })
}