import React from 'react';
import { broadcast } from '../javascript/broadcast';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addBroadcaster } from '../store/actions/broadcastActions';

class ScreenShare extends React.Component{
    state = {
        broadcastName: '',
        option: 'Audio + Video',
        video: null,
        stream: null
    }

    io = window.io;
    videocontainer = React.createRef();
    broadcastname = React.createRef();
    setupnewbroadcast = React.createRef();
    broadcastervideo = React.createRef();
    DetectRTC = window.DetectRTC;
    broadcastUI = broadcast(this.config, this.broadcastervideo)

    config = {
      openSocket: function(config) {
          var SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';
          config.channel = config.channel || this.props.auth.uid;
          var sender = Math.round(Math.random() * 999999999) + 999999999;
          this.io.connect(SIGNALING_SERVER).emit('new-channel', {
              channel: config.channel,
              sender: sender
          });
          var socket = this.io.connect(SIGNALING_SERVER + config.channel);
          socket.channel = config.channel;
          socket.on('connect', function () {
              if (config.callback) config.callback(socket);
          });
          socket.send = function (message) {
              socket.emit('message', {
                  sender: sender,
                  data: message
              });
          };
          socket.on('message', config.onmessage);
      },
      onNewParticipant: function(numberOfViewers) {
          document.title = 'Viewers: ' + numberOfViewers;
      },
      onReady: function() {
          console.log('now you can open or join rooms');
      }
  }

    componentDidMount(){
        console.log(this.props.auth)
        console.log('config', this.config)
    }

    captureUserMedia = (callback) => {
        let constraints = null;
        window.option = this.state.option;
        let option = window.option;
    
        if (option === 'Only Audio') {
          constraints = {
              audio: true,
              video: false
          };
          if(this.DetectRTC.hasMicrophone !== true) {
              alert('DetectRTC library is unable to find microphone; maybe you denied microphone access once and it is still denied or maybe microphone device is not attached to your system or another app is using same microphone.');
          }
          }
          if (option === 'Screen') {
              constraints = {
                  audio: false,
                  video: {
                    mandatory: {
                      chromeMediaSource: 'desktop',
                      maxWidth: 1920,
                      maxHeight: 1080,
                      maxFrameRate: 10,
                      minAspectRatio: 1.77,
                      // chromeMediaSourceId: sourceId         
                    }
                }
              };
              if(this.DetectRTC.isScreenCapturingSupported !== true) {
                alert('DetectRTC library is unable to find screen capturing support. You MUST run chrome with command line flag "chrome --enable-usermedia-screen-capturing"');
              }
          }
          if (option !== 'Only Audio' && option !== 'Screen' && this.DetectRTC.hasWebcam !== true) {
              alert('DetectRTC library is unable to find webcam; maybe you denied webcam access once and it is still denied or maybe webcam device is not attached to your system or another app is using same webcam.');
          }
    
          this.setState({
            video: true
          })
    
          var mediaConfig = {
            // video: this.broadcastervideo,
            video:  {
              // mediaSource: "screen", // whole screen sharing
              mediaSource: "window", // choose a window to share
              // mediaSource: "application", // choose a window to share
              width: {max: '1920'},
              height: {max: '1080'},
              frameRate: {max: '10'}
            
            },
            onsuccess: function(stream) {
                this.config.attachStream = stream;
                
                // this.videosContainer.appendChild(htmlElement);
                callback && callback();
            },
            onerror: function() {
                if (option === 'Only Audio') alert('unable to get access to your microphone');
                else if (option === 'Screen') {
                    // if (location.protocol === 'http:') alert('Please test this WebRTC experiment on HTTPS.');
                    alert('Screen capturing is either denied or not supported. Are you enabled flag: "Enable screen capture support in getUserMedia"?');
                } else alert('unable to get access to your webcam');
            }
        };
        if (constraints) mediaConfig.constraints = constraints;
        // navigator.mediaDevices.getUserMedia(mediaConfig)
        //   .then((stream) => {
        //     this.onSuccessWithSrcObject(stream)
        //   })
        navigator.mediaDevices.getDisplayMedia({
          video: true
        }).then(screenStream => {
          this.onSuccessWithSrcObject(screenStream)
        })
    
      }

      handleChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    
      setupNewBroadcastButtonClickHandler = () => {
        this.DetectRTC.load(() => {
          this.captureUserMedia(() => {
            let shared = 'video';
            if(window.option === 'Only Audio') {
              shared = 'audio';
            }
            if(window.option === 'screen'){
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
              isAudio: shared === 'audio'
            })
          })
        })
      }

      onSuccessWithSrcObject = (stream) => {
        let uid = this.props.auth
        this.broadcastervideo.srcObject = stream
        this.props.addBroadcaster(uid);
      }

    render(){
        return(
            <div>
                <section className="experiment">
        <section>
          <select id="broadcasting-option" name='option' value={this.state.option} onChange={this.handleChange}>
            <option value="Audio + Video">Audio + Video</option>
            <option value="Only Audio">Only Audio</option>
            <option value="Screen">Screen</option>
          </select>
          <input 
            type="text" 
            id="broadcast-name"
            ref={this.broadcastname}
            name='broadcastName'
            onChange={this.handleChange}
            value={this.state.broadcastName}
            />
          <button 
            id="setup-new-broadcast" 
            className="setup"
            ref={this.setupnewbroadcast}
            onClick={this.setupNewBroadcastButtonClickHandler}
            >Setup New Broadcast</button>

          <table id="rooms-list"></table>
          <div 
            id="videos-container"
            ref={this.videocontainer}
            >
              {this.state.video ? <video id="peerVideo" ref={el => this.broadcastervideo = el} autoPlay/> : null}
            </div>
        </section>
      </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addBroadcaster: (palette) => dispatch(addBroadcaster(palette)) 
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenShare));