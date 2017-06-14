import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { setTimeStart } from '../actions';

import DrawArea from './../components/DrawArea.jsx';
import Countdown from './../components/Countdown.jsx';
import firebase from './../firebase';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
  },
  button: {
    margin: 12,
  },
  term: {
    fontSize: 25,
    padding: 10,
    textAlign: 'center',
    fontWeight: 100,
    borderBottom: '1px solid #25737c',
    margin: '40px 250px',
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

@connect(store => ({
  over: store.over,
}))
export default class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: 'Tami',
      user2: 'Michi',
      term: {},
      terms: [],
      error: '',
      timeRemaining: 50,
      start: false,
    };
  }
  static propTypes = {
    over: PropTypes.bool,
    dispatch: PropTypes.func,
  };


  getNewTerm() {
    const tempTerms = [];
    firebase.database().ref('draw').once('value')
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const term = childSnapshot.key;
            const points = childSnapshot.val();

            tempTerms.push({ term, points });
            this.setState({ terms: tempTerms });
          });
        })
        .then(() => {
          this.getOneTerm();
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
  }

  getOneTerm() {
    const rand = Math.floor((Math.random() * this.state.terms.length));
    this.setState({ term: this.state.terms[rand] });
  }
  start() {
    this.setState({ start: true });
    this.props.dispatch(setTimeStart());
  }

  componentDidMount() {
    this.getNewTerm();
  }

  render() {
    if (this.state.start) {
      if (this.props.over) {
        return (<div>
            <h1>Draw-Game</h1>
            <h2>{ this.state.user1 }: XX points | { this.state.user2 }: XX points</h2>
            <Countdown timeRemaining={this.state.timeRemaining}/>
              <h3>Sorry, time is up!</h3>
          </div>
        );
      }
      return <div>
        <h1>Draw-Game</h1>
        <h2>{ this.state.user1 }: XX points | { this.state.user2 }: XX points</h2>
        <Countdown timeRemaining={this.state.timeRemaining}/>
        <Paper style={styles.container}>
          <DrawArea/>
        </Paper>
        <p style={{ ...styles.term }}>{this.state.term.term}</p>
        <p className="error">{this.state.error}</p>
      </div>;
    }
    return <div>
      <h1>Draw-Game</h1>
      <h2>{ this.state.user1 }: XX points | { this.state.user2 }: XX points</h2>
      <RaisedButton
          label="Start"
          labelPosition="before"
          style={styles.button}
          containerElement="label">
        <input type="submit" style={styles.exampleImageInput} onClick={ () => this.start() }/>
        </RaisedButton>
    </div>;
  }
}
