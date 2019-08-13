import React from 'react';
import firebase from '../firebase';
import { NavLink } from 'react-router-dom';

class Home extends React.Component{

    state = {
        streams: []
    }

    componentDidMount(){
        let broadcasts = firebase.database().ref(`broadcasting`);
        broadcasts.on('value', data => {
            let streams = [];
            data.forEach(child => {
                streams.push({
                    ...child.val()
                })
            })
            let broadcasting = []
            streams.map(stream => broadcasting.push(stream.uid))
            this.setState({
                streams: broadcasting
            })
        })
    }

    render(){
        return(
            <div>
                {Object.values(this.state.streams).map(stream => <div key={stream}><NavLink to={`/${stream}`}>{stream}</NavLink></div>)}
            </div>
        )
    }
}

export default Home;