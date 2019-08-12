import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authreducer';
import broadcastreducer from './broadcastreducer';

const rootReducer = combineReducers({
    auth: authReducer,
    firebase: firebaseReducer,
    broadcast: broadcastreducer
})

export default rootReducer;