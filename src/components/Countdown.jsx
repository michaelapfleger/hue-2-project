import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'material-ui/svg-icons/image/timer';
import { connect } from 'react-redux';
import setTimeOver from '../actions';


@connect(store => ({
  over: store.over,
}))
export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
    };
  }
  static propTypes = {
    timeRemaining: PropTypes.number,
    over: PropTypes.bool,
    dispatch: PropTypes.func,
  };
  componentDidMount() {
    this.setState({ timeRemaining: this.props.timeRemaining });
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({ timeRemaining: this.state.timeRemaining - 1 });
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.interval);
      this.props.dispatch(setTimeOver());
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
        <span className="time-left"><Timer/> { this.state.timeRemaining}</span>
    );
  }
}

