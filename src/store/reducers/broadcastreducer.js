const initState = {
    broadcasters: []
};

const broadcastReducer = (state = initState, action) => {
    switch(action.type){
        case 'ADD_BROADCAST':
                console.log(`added broadcast`, action.broadcast);
                return { broadcasters: [...action.broadcast]};
        case 'ADD_BROADCAST_ERROR':
                console.log('add broadcast error', action.err);
                return state;
        default:
            return state;
    }
}

export default broadcastReducer;