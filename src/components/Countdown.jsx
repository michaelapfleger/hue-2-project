import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'material-ui/svg-icons/image/timer';
import { connect } from 'react-redux';
import Sound from 'react-sound';
import { setTimeOver, setUser } from '../actions';
import firebase from './../firebase';


@connect(store => ({
  over: store.over,
  user: store.user,
}))
export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
      status: Sound.status.PAUSED,
    };
  }
  static propTypes = {
    timeRemaining: PropTypes.number,
    over: PropTypes.bool,
    user: PropTypes.object,
    dispatch: PropTypes.func,
  };
  componentDidMount() {
    this.setState({ timeRemaining: this.props.timeRemaining });
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({ timeRemaining: this.state.timeRemaining - 1 });
    if (this.state.timeRemaining === 5) {
      this.setState({ status: Sound.status.PLAYING });
    }
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.interval);
      this.props.dispatch(setTimeOver());
      this.props.dispatch(setUser({
        ...this.props.user, ready: false,
      }));
      firebase.database().ref(`users/${this.props.user.uid}`).update({
        '/ready': false,
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.dispatch(setUser({
      ...this.props.user, ready: false,
    }));
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/ready': false,
    });
  }
  render() {
    return (
        <span className="time-left"><Timer/> { this.state.timeRemaining}
          <Sound
              url="https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/counter.mp3"
              playStatus={this.state.status}
              playFromPosition={0}
              volume={100}
              onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)}
              onPlaying={({ position }) => console.log(position) }
              onFinishedPlaying={() => this.setState({ status: Sound.status.STOPPED })}
          />
        </span>
    );
  }
}

