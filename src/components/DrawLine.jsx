import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

export default class DrawLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathData: '',
    };
  }

  static propTypes = {
    line: PropTypes.instanceOf(Immutable.Iterable),
    color: PropTypes.string,
  };

  componentWillReceiveProps() {
    const pathData = `M ${this.props.line
            .map(p => `${p.get('x')} ${p.get('y')}`)
            .join(' L ')}`;
    this.setState({ pathData });
  }

  render() {
    return (
        <path className="path" d={ this.state.pathData } stroke={this.props.color}/>
    );
  }
}
