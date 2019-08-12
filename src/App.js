import React from 'react';
import './App.css';
import ScreenShare from './components/ScreenShare';
import Signin from './components/auth/Signin';
import Register from './components/auth/Register';
import socket from 'socket.io-client';
import { Route, withRouter } from 'react-router-dom';

class App extends React.Component {
  state = {
    
  }

  componentDidMount(){
    
  }

  render(){
  return (
    <div className="App">
      <Route path='/register' render={props => <Register {...props}/>}></Route>
      <Route path='/signin' render={props => <Signin {...props}/>}></Route>
      <Route exact path='/' render={props => <ScreenShare {...props}/>} />
    </div>
  );
}
}

export default withRouter(App);
