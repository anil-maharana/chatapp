import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import notification from './notification';

export default combineReducers({
    alert, auth, notification
})