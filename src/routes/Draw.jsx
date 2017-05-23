import React from 'react';
import Paper from 'material-ui/Paper';

import DrawArea from './../components/DrawArea.jsx';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
  },
  term: {
    fontSize: 25,
    padding: 10,
    textAlign: 'center',
    fontWeight: 100,
    borderBottom: '1px solid #25737c',
    margin: '40px 250px',
  },
};

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: 'Tami',
      user2: 'Michi',
      term: 'unicorn',
    };
  }

  render() {
    return <div>
      <h1>Draw-Game</h1>
      <h2>{ this.state.user1 }: XX points | { this.state.user2 }: XX points</h2>
      <span className="time-left">time: 00:00</span>
      <Paper style={styles.container}>
        <DrawArea/>
      </Paper>
      <p style={{ ...styles.term }}>{this.state.term}</p>
    </div>;
  }
}
