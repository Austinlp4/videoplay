import React from 'react';
import './App.css';
import ScreenShare from './components/ScreenShare';
import socket from 'socket.io-client';
import { Route, withRouter } from 'react-router-dom';

class App extends React.Component {

  state = {
    broadcastName: '',
    option: 'Audio + Video',
    video: null,
    stream: null
  }


  componentDidMount(){
    
  }


  render(){
  return (
    <div className="App">
      <ScreenShare {...this.props}></ScreenShare>
    </div>
  );
}
}

export default withRouter(App);
