import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

@connect(store => ({
  user: store.user,
  opponent: store.opponent,
}))
export default class OverviewPoints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
  };

  render() {
    return <div>
      <h2>
        { this.props.user.username ? this.props.user.username : this.props.user.email }:
        { this.props.user ? this.props.user.points : '0'} points | { this.props.opponent.username ?
          this.props.opponent.username : this.props.opponent.email }:
        { this.props.opponent ? this.props.opponent.points : '0'} points
      </h2>
    </div>;
  }
}

