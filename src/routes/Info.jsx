import React from 'react';
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

  render() {
    return <div>
      <h1>Info</h1>
      <Paper style={styles.container}>
        <p>
          Developer: Michaela Pfleger & Tamara Czakert<br/>
          Contact: info@paulem.eu<br/>
          Version: {this.state.version}
        </p>
        <h2>Explanation</h2>
        <p>
          Online two-player game for drawing unsolvable terms.
        </p>
      </Paper>
    </div>;
  }
}
