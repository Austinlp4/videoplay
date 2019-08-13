import React from 'react';
import { broadcast } from '../javascript/broadcast';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addBroadcaster } from '../store/actions/broadcastActions';
import Broadcast from './Broadcast';

class ScreenShare extends React.Component{
    state = {
        video: null,
        stream: null
    }

    socket = window.socket;
    videocontainer = React.createRef();
    broadcastname = React.createRef();
    setupnewbroadcast = React.createRef();
    broadcastervideo = React.createRef();
    DetectRTC = window.DetectRTC;
    config = window.config;
    broadcastUI = broadcast(this.config, this.broadcastervideo, this.onRoomFound)

    componentDidMount(){
        console.log('config.channel', broadcast(this.config, this.broadcastervideo))
        console.log('pathname', `/${this.props.auth.uid}`, this.props.location.pathname)
        if(`/${this.props.auth.uid}` !== this.props.location.pathname ){
          this.broadcastUI.joinRoom({
            roomToken: this.props.location.pathname,
            joinUser: this.props.location.pathname
          })
        }
        this.setState({
          video: true
        })
    }

    onRoomFound = (room) => {
      this.broadcastUI.joinRoom({
        roomToken: room.broadcaster,
        joinUser: room.broadcaster
      })
    }

    captureUserMedia = (callback) => {
        let constraints = null;
        window.option = this.state.option;
        let option = window.option;
    
          if(this.DetectRTC.hasMicrophone !== true) {
              alert('DetectRTC library is unable to find microphone; maybe you denied microphone access once and it is still denied or maybe microphone device is not attached to your system or another app is using same microphone.');
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

      // handleChange = event => {
      //   this.setState({
      //     [event.target.name]: event.target.value
      //   })
      // }
    
      setupNewBroadcastButtonClickHandler = () => {
        this.DetectRTC.load(() => {
          this.captureUserMedia(() => {
            // let shared = 'video';
            // let roomName = this.props.username;
            // // this.broadcastUI.createRoom({
            // //   roomName: roomName,
            // //   isAudio: shared === 'audio'
            // // })
          })
        })
      }

      onSuccessWithSrcObject = (stream) => {
        this.setState({
          stream: stream
        })
        let uid = this.props.auth.uid
        this.broadcastervideo.srcObject = stream
        this.props.addBroadcaster(uid);
      }

    render(){
        return(
            <div>
                <section className="experiment">
        <section>
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
            <Broadcast stream={this.state.stream}/>
        </section>
      </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  console.log('state', state)
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    username: state.firebase.profile.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addBroadcaster: (palette) => dispatch(addBroadcaster(palette)) 
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenShare));