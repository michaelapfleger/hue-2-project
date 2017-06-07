import React from 'react';
import PropTypes from 'prop-types';

export default class Line extends React.Component {
  static propTypes = {
    message: PropTypes.object,
  };

  render() {
    return (
        <p key={this.props.message.size}>helo </p>
    );
  }
}
