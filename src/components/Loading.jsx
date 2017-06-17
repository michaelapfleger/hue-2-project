import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'halogen/PulseLoader';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    return (
        <div>
          <p>{ this.props.text }</p>
          <Loader color="#25737c" size="16px" margin="4px"/>
        </div>
    );
  }
}
