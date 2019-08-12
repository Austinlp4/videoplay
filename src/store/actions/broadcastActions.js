export const addBroadcaster = (uid) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        firebase.database().ref(`broadcasting/${uid}`).set({
            uid: uid        
        })
        .then(() => {
            dispatch({ type: 'ADD_BROADCASTER', uid })
        }).catch((err) => {
            dispatch({ type: 'ADD_BROADCAST_ERROR' })
        })
    }
};