import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Sound from 'react-sound';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import NoOpponentSelected from './../components/NoOpponentSelected.jsx';
import Term from './../components/Term.jsx';
import OverviewPoints from './../components/OverviewPoints.jsx';
import { setTimeStart, addPointsToUser, setTerm, setUser, setSuccess, setOpponent } from '../actions';
import Countdown from './../components/Countdown.jsx';
import firebase from './../firebase';
import Call from '../components/CallAudio.jsx';
import { send } from '../ws';

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
  user: store.user,
  opponent: store.opponent,
  over: store.over,
  structure: store.structure,
  term: store.term,
  success: store.success,
}))
export default class Explain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: {},
      terms: [],
      error: '',
      timeRemaining: 50,
      start: false,
      status: Sound.status.PAUSED,
      statusWin: Sound.status.PAUSED,
      guess: '',
      guessInput: '',
      redirect: '',
      guessWrong: false,
      sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/wrong.mp3',
      success: false,
      wrongGuesses: [],
    };
  }

  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
    term: PropTypes.object,
    over: PropTypes.bool,
    structure: PropTypes.array,
    dispatch: PropTypes.func,
    success: PropTypes.bool,
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
      console.log('ready');
      if (!this.state.start) {
        this.setState({ start: true });
        this.props.dispatch(setTimeStart());
      }
    }

    if (!this.state.start && document.getElementsByTagName('video').length === 1) {
      console.log('start now', this.state.start);
      // this.start();
    }
  }

  componentDidMount() {
    send('join', 'all', this.props.user.username);
    firebase.database().ref(`/users/${this.props.user.uid}`).once('value')
        .then((snapshot) => {
          const opponentUser = {
            username: snapshot.val().username,
            uid: snapshot.val().uid,
            points: snapshot.val().points,
            online: true,
            start: false,
            role: snapshot.val().role,
            opponent: snapshot.val().opponent,
            ready: false,
          };
          console.log('hier', opponentUser);
          this.props.dispatch(setUser({ ...this.props.user, opponentUser }));
        });
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

  startCall(name) {
    console.log(name, this.state);
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
      this.setState({
        success: true,
        sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/win.mp3',
        statusWin: Sound.status.PLAYING,
      });
      this.props.dispatch(setSuccess(true));
    } else {
      this.setState({ guessWrong: true, guessInput: '' });
      const wrongGuesses = this.state.wrongGuesses;
      wrongGuesses.push(guess);
      this.setState({ wrongGuesses });
      this.setState({
        sound: 'https://raw.githubusercontent.com/michaelapfleger/hue-2-project/master/public/wrong.mp3',
        status: Sound.status.PLAYING,
      });
    }
  }

  guess(input) {
    this.setState({
      guessInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
      guessWrong: false,
    });
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
    this.setState({ redirect: this.props.structure[0] });
  }

  render() {
    if (this.props.user.role === 'none') {
      return (<NoOpponentSelected/>);
    }
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect}/>);
    }
    if (this.props.success) {
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
    return <div>
      {(this.state.start && this.props.over) && <div>
        <Paper style={styles.container}>
          <h3>Sorry, time is up!</h3>
          <RaisedButton label="Next round"
                        primary={true}
                        onTouchTap={() => this.switchRole()}/>
        </Paper>
      </div>}
      { !this.props.over && <div>
      <h1>Explain-Game</h1>
      <OverviewPoints/> </div>}
      { this.state.start && <Countdown timeRemaining={this.state.timeRemaining}/> }
      { !this.props.over && <div>
      <Call ref={call => (this.Call = call)} role={this.props.user.role} />

      { (this.state.start && this.props.user.role === 'actor') &&
      <div>
        <Term term={this.state.term.term} error={this.state.error}/>
        <Sound
            url={this.state.sound}
            playStatus={this.state.status}
            playFromPosition={0}
            volume={100}
            onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)}
            onPlaying={({ position }) => console.log(position) }
            onFinishedPlaying={() => this.setState({ status: Sound.status.STOPPED })}
        />
      </div>

      }
      { (this.state.start && this.props.user.role === 'guesser' && this.state.guessWrong) &&
      <p>Your guess is wrong!!</p> }
      { (this.props.user.role === 'guesser' && this.state.wrongGuesses.length > 0) && <div><h5 style={styles.h5}>Your wrong guesses:</h5><ul style={styles.ul}>
        { this.state.wrongGuesses.map((item, i) => <li style={styles.li} key={i}>{item}</li>) }
      </ul></div> }
      { (this.state.start && this.props.user.role === 'guesser') &&
      <div>
        <TextField floatingLabelText="Enter your guess"
                   fullWidth={false}
                   value={this.state.guessInput}
                   onChange={(e, v) => this.guess(v)}/>
        <RaisedButton label="Guess"
                      primary={true}
                      disabled={!this.state.guessInput}
                      onTouchTap={() => this.submitGuess()}/>
        <Sound
            url={this.state.sound}
            playStatus={this.state.status}
            playFromPosition={0}
            volume={100}
            onLoading={({ bytesLoaded, bytesTotal }) => console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)}
            onPlaying={({ position }) => console.log(position) }
            onFinishedPlaying={() => this.setState({ status: Sound.status.STOPPED })}
        />
      </div>
      }
      </div> }
    </div>;
  }
}
