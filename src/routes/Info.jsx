import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';

import pkg from '../../package.json';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
  },
};

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: pkg.version,
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
  };

  render() {
    return <div>
      <h1>Info</h1>
      <Paper style={styles.container}>
        <p>
          Developer: Michaela Pfleger & Tamara Czakert<br/>
          Contact: michaela.pfleger@students.fh-hagenberg.at | <br/>
          tamara.czakert@students.fh-hagenberg.at<br/>
          Version: {this.state.version}
        </p>
        <b>Explanation</b>
        <p>
          Online two-player game for drawing unsolvable terms.
        </p>
      </Paper>
    </div>;
  }
}

