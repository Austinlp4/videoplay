import React from 'react';
import './App.css';
import socket from 'socket.io-client';

class App extends React.Component {

  videocontainer = React.createRef();

  componentDidMount(){
    // let openSocket = socket('https://zyro-one.herokuapp.com/');
    const config = window.config;
    console.log(config);

  }

  onRemoteStream = (element) => {
    this.videocontainer.appendChild(element);
  }

  render(){
  return (
    <div className="App">
      <section className="experiment">
        <section>
          <select id="broadcasting-option">
            <option value="Audio + Video">Audio + Video</option>
            <option value="Only Audio">Only Audio</option>
            <option value="Screen">Screen</option>
          </select>
          <input type="text" id="broadcast-name"/>
          <button id="setup-new-broadcast" className="setup">Setup New Broadcast</button>

          <table id="rooms-list"></table>
          <div 
            id="videos-container"
            ref={this.videocontainer}
            ></div>
        </section>
      </section>
    </div>
  );
}
}

export default App;
