import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Sound from 'react-sound';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { setTimeStart, addPointsToUser, setTerm, setUser, setSuccess, setOpponent } from '../actions';
// import { on, off, send } from '../ws';

import NoOpponentSelected from './../components/NoOpponentSelected.jsx';
import OverviewPoints from './../components/OverviewPoints.jsx';
import DrawArea from './../components/DrawArea.jsx';
import Countdown from './../components/Countdown.jsx';
import Loading from './../components/Loading.jsx';
import firebase from './../firebase';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
  },
  button: {
    margin: 12,
  },
  h5: {
    marginBottom: 0,
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  li: {
    paddingLeft: 0,
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
  success: store.success,
  structure: store.structure,
  term: store.term,
}))
export default class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: {},
      terms: [],
      status: Sound.status.PAUSED,
      statusWin: Sound.status.PAUSED,
      error: '',
      timeRemaining: 50,
      start: false,
      guess: '',
      guessInput: '',
      redirect: '',
      guessWrong: false,
      waiting: false,
      sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/wrong.mp3',
      success: false,
      wrongGuesses: [],
    };
  }
  static propTypes = {
    over: PropTypes.bool,
    success: PropTypes.bool,
    user: PropTypes.object,
    term: PropTypes.object,
    opponent: PropTypes.object,
    structure: PropTypes.array,
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
    this.props.dispatch(setTerm(this.state.terms[rand]));
    // store to database
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/term': this.state.terms[rand],
    });
    firebase.database().ref(`users/${this.props.opponent.uid}`).update({
      '/term': this.state.terms[rand],
    });
  }
  start() {
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/ready': true,
    });
    this.props.dispatch(setUser({
      ...this.props.user, ready: true,
    }));
    if (!this.props.opponent.ready) {
      this.setState({ waiting: true });
    }
  }
  addPoints() {
    this.props.dispatch(addPointsToUser(
        { ...this.props.user, points: this.props.user.points + this.props.term.points },
    ));
    // save to database
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/points': this.props.user.points + this.props.term.points,
    });
  }

  componentDidUpdate() {
    if (this.props.user.ready && this.props.opponent.ready) {
      if (!this.state.start) {
        this.setState({ start: true, waiting: false });
        this.props.dispatch(setTimeStart());
      }
    }
  }
  componentDidMount() {
    if (this.props.user && this.props.user.role === 'actor') {
      this.getNewTerm();
    }
    firebase.database().ref(`/users/${this.props.opponent.uid}`).on('child_changed', (snap) => {
      if (snap.key === 'ready') {
        console.log('opponent changed his ready state to ', snap.val());
        this.props.dispatch(setOpponent({
          ...this.props.opponent,
          ready: snap.val(),
        }));
      }
      if (snap.key === 'points') {
        this.props.dispatch(setSuccess(true));
      }
      if (snap.key === 'term') {
        this.props.dispatch(setTerm(snap.val()));
      }
    });
  }
  submitGuess(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ guess: this.state.guessInput });
    this.checkGuess(this.state.guessInput);
  }
  checkGuess(guess) {
    const correct = guess.localeCompare(this.props.term.term);
    if (correct === 0) {
      this.addPoints();
      this.setState({ guessWrong: false });
      this.setState({ success: true, sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/win.mp3', statusWin: Sound.status.PLAYING });
      this.props.dispatch(setSuccess(true));
      firebase.database().ref(`users/${this.props.user.uid}`).update({
        '/ready': false,
      });
      this.props.dispatch(setUser({
        ...this.props.user, ready: false,
      }));
    } else {
      this.setState({ guessWrong: true, guessInput: '' });
      const wrongGuesses = this.state.wrongGuesses;
      wrongGuesses.push(guess);
      this.setState({ wrongGuesses });
      this.setState({ sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/wrong.mp3', status: Sound.status.PLAYING });
    }
  }
  guess(input) {
    this.setState({
      guessInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
      guessWrong: false,
    });
  }
  componentWillUnmount() {
    this.setState({ success: false });
    clearTimeout();
    this.props.dispatch(setTerm(null));
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/term': '',
    });
    firebase.database().ref(`users/${this.props.opponent.uid}`).update({
      '/term': '',
    });
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/ready': false,
    });
    this.props.dispatch(setUser({
      ...this.props.user, ready: false,
    }));
    this.props.dispatch(setSuccess(false));
  }

  switchRole() {
    console.log('role: ', this.props.user.role);
    let userRole = 'actor';
    if (this.props.user.role === 'actor') {
      userRole = 'guesser';
      console.log('change to guesser: ', this.props.user.role);
    }
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/role': `${userRole}`,
    })
        .then(() => {
          this.props.dispatch(setUser({ ...this.props.user, role: userRole }));
          // this.props.dispatch(setOpponent({ ...this.props.opponent, role: userRole }));

          console.log('role changed ######################');
        })
        .then(() => {
          console.log('next round');
          this.nextRound();
        });
  }
  nextRound() {
    // this.switchRole();
    this.setState({ redirect: this.props.structure[1] });
  }

  render() {
    if (!this.props.user.role === 'none') {
      return (<NoOpponentSelected/>);
    }
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect} />);
    }
    if (this.props.success) {
      if (this.props.user.role === 'guesser') {
        return (
            <Paper style={styles.container}>
              <h3>Congratulations!</h3>
              <h4>Your guess was correct!</h4>
              <RaisedButton label="Next round"
                            primary={true}
                            onTouchTap={() => this.switchRole()}/>
              <Sound
                  url={this.state.sound}
                  playStatus={this.state.statusWin}
                  playFromPosition={0}
                  volume={100}
                  onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)}
                  onPlaying={({ position }) => console.log(position) }
                  onFinishedPlaying={() => this.setState({ statusWin: Sound.status.STOPPED })}
              />
            </Paper>
        );
      }
      return (
          <Paper style={styles.container}>
            <h4>Your opponent guessed correct!</h4>
            <RaisedButton label="Next round"
                          primary={true}
                          onTouchTap={() => this.switchRole()}/>
          </Paper>
      );
    }
    if (this.state.start) {
      return <div>
       { !this.props.over && <div>
        <h1>Draw-Game</h1>
        <OverviewPoints/> </div>}
        { this.props.over && <div>
          <Paper style={styles.container}>
            <h3>Sorry, time is up!</h3>
            <RaisedButton label="Next round"
                          primary={true}
                          onTouchTap={() => this.switchRole()}/>
          </Paper>
        </div> }
        <Countdown timeRemaining={this.state.timeRemaining}/>
        { !this.props.over && <div>
        <Paper style={styles.container}>
          <DrawArea user={this.props.user}/>
        </Paper>
        { this.props.user.role === 'actor' && <div><p style={{ ...styles.term }}>{this.props.term.term}</p></div> }
        { this.props.user.role === 'actor' && <p className="error">{this.state.error}</p> }
        {(this.props.user.role === 'guesser' && this.state.guessWrong) && <h4>Your guess is wrong!</h4> }
        { (this.props.user.role === 'guesser' && this.state.wrongGuesses.length > 0) && <div><h5 style={styles.h5}>Your wrong guesses:</h5><ul style={styles.ul}>
        { this.state.wrongGuesses.map((item, i) => <li style={styles.li} key={i}>{item}</li>) }
        </ul></div> }
        { this.props.user.role === 'guesser' && <div>
          <TextField floatingLabelText="Enter your guess"
                     fullWidth={false}
                     value={this.state.guessInput}
                     onChange={(e, v) => this.guess(v)}/>
          <RaisedButton label="Guess"
                        primary={true}
                        disabled={!this.state.guessInput}
                        onTouchTap={() => this.submitGuess()}/>
        </div> }
        </div> }
        <Sound
            url={this.state.sound}
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
      <OverviewPoints/>
      <RaisedButton
          label="Start"
          labelPosition="before"
          style={styles.button}
          containerElement="label">
        <input type="submit" style={styles.exampleImageInput} onClick={ () => this.start() }/>
      </RaisedButton>
      { this.state.waiting && <Loading text="Waiting for opponent..."/> }
    </div>;
  }
}
