import React from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import { send, on, off } from '../ws';

const CALL_STATE_NONE = 'none';
const CALL_STATE_CONFIRM = 'confirm';
const CALL_STATE_RINGING = 'ringing';
const CALL_STATE_DIALING = 'dialing';
const CALL_STATE_ACTIVE = 'active';

const mediaConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  },
};

const styles = {
  localVideo: {
    position: 'absolute',
    width: '30%',
    transform: 'scaleX(-1)',
    bottom: 0,
    left: 0,
    display: 'none',
  },
  remoteVideo: {
    width: '100%',
    minHeight: 500,
    display: 'none',
  },
};

export default class CallVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localVideo: null,
      remoteVideo: null,
      callState: CALL_STATE_NONE,
      remoteName: null,
    };
    this.connection = null;
  }

  static propTypes = {
    role: PropTypes.string,
  };

  componentDidMount() {
    on('offer', (from, offer) => {
      if (from === this.state.remoteName) {
        this.connection.setRemoteDescription(new RTCSessionDescription(offer));
        this.connection.createAnswer((sessionDescription) => {
          this.connection.setLocalDescription(sessionDescription);
          send('answer', this.state.remoteName, sessionDescription);
        }, (err) => {
          console.error('error creating answer', err);
        }, mediaConstraints);
      } else {
        console.warn('got offer, but not from whom i expected', from, this.state.remoteName);
      }
    });

    on('answer', (from, answer) => {
      if (from === this.state.remoteName) {
        this.connection.setRemoteDescription(new RTCSessionDescription(answer));
      } else {
        console.warn('got answer, but not from whom i expected', from, this.state.remoteName);
      }
    });

    on('iceCandidate', (from, iceCandidate) => {
      if (from === this.state.remoteName) {
        this.connection.addIceCandidate(new RTCIceCandidate({
          sdpMLineIndex: iceCandidate.label,
          candidate: iceCandidate.candidate,
        }));
      } else {
        console.warn('got icecandidate, but not from whom i expected', from, this.state.remoteName);
      }
    });

    on('call', (from) => {
      this.setState({
        callState: CALL_STATE_RINGING,
        remoteName: from,
      });
    });

    on('accept', () => {
      this.setupConnection();
    });

    on('hangup', () => {
      this.setState({
        callState: CALL_STATE_NONE,
        remoteName: null,
      });
    });
  }

  componentWillUnmount() {
    off('offer');
    off('answer');
    off('iceCandidate');
    off('call');
    off('accept');
    off('hangup');
    this.hangup();
  }

  setupConnection() {
    this.connection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    }, mediaConstraints);

    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        send('iceCandidate', this.state.remoteName, {
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      }
    };

    this.connection.onaddstream = (event) => {
      if (!this.connection.stream) {
        this.connection.stream = event.stream;
        this.setState({
          remoteVideo: window.URL.createObjectURL(event.stream),
        });
      }
    };

    this.connection.addStream(this.stream);

    if (this.state.callState === CALL_STATE_DIALING) {
      this.connection.createOffer((sessionDescription) => {
        this.connection.setLocalDescription(sessionDescription);
        send('offer', this.state.remoteName, sessionDescription);
      }, (err) => {
        console.error('error creating offer', err);
      }, mediaConstraints);
    }

    this.setState({
      localVideo: window.URL.createObjectURL(this.stream),
    });

    this.setState({
      callState: CALL_STATE_ACTIVE,
    });
  }

  startCall(name) {
    this.setState({
      callState: CALL_STATE_CONFIRM,
      remoteName: name,
    });
  }

  confirm() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    }).then((stream) => {
      send('call', this.state.remoteName);
      this.setState({
        callState: CALL_STATE_DIALING,
      });
      this.stream = stream;
    }).catch(e => console.error('error accessing cam and mic', e));
  }

  accept() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    }).then((stream) => {
      this.stream = stream;
      this.setupConnection();
      send('accept', this.state.remoteName);
    }).catch(e => console.error('error accessing cam and mic', e));
  }

  hangup() {
    this.setState({
      callState: CALL_STATE_NONE,
      remoteName: null,
    });
    this.connection = null;
    send('hangup', this.state.remoteName);
  }

  getCallActionButtons() {
    if (this.state.callState === CALL_STATE_CONFIRM) {
      return [
        <FlatButton key="cancel" label="Cancel" onTouchTap={() => this.hangup()}/>,
        <FlatButton key="start" label="Start" onTouchTap={() => this.confirm()}/>,
      ];
    }
    if (this.state.callState === CALL_STATE_RINGING) {
      return [
        <FlatButton key="deny" label="Deny" onTouchTap={() => this.hangup()}/>,
        <FlatButton key="accept" label="Accept" onTouchTap={() => this.accept()}/>,
      ];
    }
    if (this.state.callState === CALL_STATE_NONE) {
      return [
        <FlatButton key="none" label="none" disabled={true}/>,
      ];
    }
    return [
      <FlatButton key="hangup" label="Hangup" onTouchTap={() => this.hangup()}/>,
    ];
  }

  getCallContent() {
    if (this.state.callState === CALL_STATE_CONFIRM) {
      return <p>Do you want to call {this.state.remoteName}?</p>;
    }

    if (this.state.callState === CALL_STATE_DIALING) {
      return <p>Dialing...</p>;
    }

    if (this.state.callState === CALL_STATE_RINGING) {
      return <p>{this.state.remoteName} is calling you!</p>;
    }

    if (this.state.callState === CALL_STATE_ACTIVE) {
      if (this.props.role === 'actor') {
        return <div>
          <video style={styles.remoteVideo} src={this.state.localVideo}
                 autoPlay="autoPlay" muted poster="spinner.gif"/>
        </div>;
      } else if (this.props.role === 'guesser') {
        return <div>
          <video style={styles.remoteVideo} src={this.state.remoteVideo}
                 autoPlay="autoPlay" poster="spinner.gif"/>
        </div>;
      }
      return <p>ERROR</p>;
    }

    return null;
  }

  render() {
    return <Card>
      <CardTitle title="Explain" subtitle="audio"/>
      <CardText>
        <img src="./audio.png" width="400"/>
        {this.getCallContent()}
      </CardText>
      <CardActions>
        {this.getCallActionButtons()}
      </CardActions>
    </Card>;
  }
}
