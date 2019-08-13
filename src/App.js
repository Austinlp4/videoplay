import React from 'react';
import './App.css';
import ScreenShare from './components/ScreenShare';
import Signin from './components/auth/Signin';
import Register from './components/auth/Register';
// import socket from 'socket.io-client';
import { Route, withRouter, HashRouter } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';

class App extends React.Component {
  state = {
    
  }

  componentDidMount(){
    
  }

  render(){
  return (
    <div className="App">
      <Nav></Nav>
      <HashRouter>
        <Route path='/register' render={props => <Register {...props}/>}></Route>
        <Route path='/signin' render={props => <Signin {...props}/>}></Route>
        <Route path='/:uid' render={props => <ScreenShare {...props}/>} />
        <Route exact path='/' component={Home} />
      </HashRouter>
    </div>
  );
}
}

export default withRouter(App);
