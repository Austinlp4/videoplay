import React from 'react';

class Broadcast extends React.Component{
    state = {

    }

    render(){
        return(
            <div>
                <video srcObject={this.props.stream}></video>
            </div>
        )
    }
}

export default Broadcast;