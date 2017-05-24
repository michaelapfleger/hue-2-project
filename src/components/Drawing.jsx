import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import DrawLine from './DrawLine.jsx';

const styles = {
  drawArea: {
    width: '100%',
    height: 500,
  },
};

export default class Dawing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
    };
  }

  static propTypes = {
    lines: PropTypes.instanceOf(Immutable.Iterable),
    color: PropTypes.string,
  };

  render() {
    return (
      <svg className="drawing" style={{ ...styles.drawArea }}>
        {this.props.lines.map((line, index) => (
          <DrawLine key={index} line={line} color={this.props.color}/>
        ))}
      </svg>
    );
  }

}
