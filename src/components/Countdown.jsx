import React from 'react';
import PropTypes from 'prop-types';

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
    };
  }
  static propTypes = {
    timeRemaining: PropTypes.number,
  };
  componentDidMount() {
    this.setState({ timeRemaining: this.props.timeRemaining });
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({ timeRemaining: this.state.timeRemaining - 1 });
    if (this.state.timeRemaining <= 0) {
      clearInterval(this.interval);

      // Screensharing beenden
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
        <span className="time-left">remaining time: { this.state.timeRemaining}</span>
    );
  }
}

export default Countdown;
