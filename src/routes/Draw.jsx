import React from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { setTimeStart, addPointsToUser } from '../actions';

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
  user: store.user,
  opponent: store.opponent,
}))
export default class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: 'Tami',
      user2: 'Michi',
      term: {},
      terms: [],
      status: Sound.status.PAUSED,
      error: '',
      timeRemaining: 50,
      start: false,
      guess: '',
      guessInput: '',
      guessWrong: false,
    };
  }
  static propTypes = {
    over: PropTypes.bool,
    user: PropTypes.object,
    opponent: PropTypes.object,
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

  addPoints() {
    this.props.dispatch(addPointsToUser(
      { ...this.props.user, points: this.props.user.points + 5 },
    ));

    // save to database
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/points': this.props.user.points + 5,
    });

    // runde beenden
  }

  componentDidMount() {
    this.getNewTerm();
  }

  submitGuess(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ guess: this.state.guessInput });
    this.checkGuess(this.state.guessInput);
  }
  checkGuess(guess) {
    const correct = guess.localeCompare(this.state.term.term);
    if (correct === 0) {
      this.addPoints();
      this.setState({ status: Sound.status.PLAYING });
      this.setState({ guessWrong: false });
    } else {
      // anzeigen dass das wort nicht stimmt!
      this.setState({ guessWrong: true });
    }
  }
  guess(input) {
    console.log('input', input);
    this.setState({
      guessInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
    });
  }


  render() {
    if (this.state.start) {
      if (this.props.over) {
        return (<div>
            <h1>Draw-Game</h1>
            <h2>
              { this.props.user.username ? this.props.user.username : this.props.user.email }:
              { this.props.user ? this.props.user.points : '0'} points |
              { this.props.opponent.username ? this.props.opponent.username :
                  this.props.opponent.email }:
              { this.props.opponent ? this.props.opponent.points : '0'} points
            </h2>
            <Countdown timeRemaining={this.state.timeRemaining}/>
              <h3>Sorry, time is up!</h3>
          </div>
        );
      }
      return <div>
        <h1>Draw-Game</h1>
        <h2>
          { this.props.user.username ? this.props.user.username : this.props.user.email }:
          { this.props.user ? this.props.user.points : '0' } points | { this.props.opponent.username ?
            this.props.opponent.username :
            this.props.opponent.email }: { this.props.opponent ? this.props.opponent.points : '0'}
            points
        </h2>
        <Countdown timeRemaining={this.state.timeRemaining}/>
        <Paper style={styles.container}>
          <DrawArea/>
        </Paper>
        <p style={{ ...styles.term }}>{this.state.term.term}</p>
        <p className="error">{this.state.error}</p>
        { this.state.guessWrong && <p>Your guess is wrong!!</p> }
        <TextField floatingLabelText="Enter your guess"
                   fullWidth={false}
                   value={this.state.guessInput}
                   onChange={(e, v) => this.guess(v)}/>
        <RaisedButton label="Guess"
                      primary={true}
                      disabled={!this.state.guessInput}
                      onTouchTap={() => this.submitGuess()}/>
        <Sound
            url="https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/win.mp3"
            playStatus={this.state.status}
            playFromPosition={0}
            volume={100}
            onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)}
            onPlaying={({ position }) => console.log(position) }
            onFinishedPlaying={() => this.setState({ status: Sound.status.STOPPED })}
        />
      </div>;
    }
    return <div>
      <h1>Draw-Game</h1>
      <h2>
        { this.props.user.username ? this.props.user.username : this.props.user.email }:
        { this.props.user ? this.props.user.points : '0'} points | { this.props.opponent.username ?
          this.props.opponent.username : this.props.opponent.email }:
        { this.props.opponent ? this.props.opponent.points : '0'}  points
      </h2>
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
