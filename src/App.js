import React from 'react';
import './App.css';
import socket from 'socket.io-client';
import { broadcast } from './javascript/broadcast';

class App extends React.Component {

  state = {
    broadcastName: ''
  }

  videocontainer = React.createRef();
  broadcastname = React.createRef();
  setupnewbroadcast = React.createRef();
  config = window.config;
  DetectRTC = window.DetectRTC;
  broadcastUI = broadcast(this.config);

  componentDidMount(){
    // let openSocket = socket('https://zyro-one.herokuapp.com/');

  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onRemoteStream = (element) => {
    this.videocontainer.appendChild(element);
  }

  onRoomFound = (room) => {
    let roomToken = room.broadcaster,
        broadcaster = room.broadcaster;

    this.broadcastUI.joinRoom({
      roomToken: roomToken,
      joinUser: broadcaster
    })
  }

  onNewParticipant = (numberOfViewers) => {

  }

  onReady = () => {
    alert('now you can open or join rooms')
  }

  setupNewBroadcastButtonClickHandler = () => {
    this.broadcastname.disabled = true;
    this.setupnewbroadcast.disabled = true;

    this.DetectRTC.load(() => {
      captureUserMedia(() => {
        let shared = 'video';
        if(window.option == 'Only Audio') {
          shared = 'audio';
        }
        if(window.option == 'screen'){
          shared = 'screen'
        }

        let roomName;

        if(this.state.broadcastName === ''){
          roomName = 'Anonymous';
        } else {
          roomName = this.state.broadcastName;
        }

        this.broadcastUI.createRoom({
          roomName: roomName,
          isAudio: shared === 'audio';
        })
      })
    })
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
          <input 
            type="text" 
            id="broadcast-name"
            ref={this.broadcastname}
            name='broadcastName'
            onChange={this.onChange}
            value={this.state.broadcastName}
            />
          <button 
            id="setup-new-broadcast" 
            className="setup"
            ref={this.setupnewbroadcast}
            >Setup New Broadcast</button>

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
