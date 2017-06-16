import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  term: {
    fontSize: 25,
    padding: 10,
    textAlign: 'center',
    fontWeight: 100,
    borderBottom: '1px solid #25737c',
    margin: '40px 250px',
  },
};

export default class Term extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    term: PropTypes.string,
    error: PropTypes.string,
  };

  render() {
    return <div>
      <p style={{ ...styles.term }}>{this.props.term}</p>
      <p className="error">{this.props.error}</p>
    </div>;
  }
}

