import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import Countdown from './../components/Countdown.jsx';
import firebase from './../firebase';
import Call from '../components/CallVideo.jsx';
import { send } from '../ws';
import { setTimeStart, setUser } from '../actions';

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

@connect(store => ({
  user: store.user,
  opponent: store.opponent,
  over: store.over,
}))
export default class Mime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: {},
      terms: [],
      error: '',
      timeRemaining: 20,
      start: false,
    };

    this.start = this.start.bind(this);
  }

  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
    over: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.getNewTerm();
    send('join', 'all', this.props.user.username);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`/users/${user.uid}`).once('value')
            .then((snapshot) => {
              const currentUser = {
                username: snapshot.val().username,
                uid: snapshot.val().uid,
                points: snapshot.val().points,
                online: snapshot.val().online,
              };
              this.props.dispatch(setUser(currentUser));
            });
        this.setState({ loggedIn: true });
      }
    });
  }

  startCall(name) {
    this.Call.startCall(name);
    // this.start();
  }

  start() {
    console.log('start now');
    this.setState({ start: true });
    this.props.dispatch(setTimeStart());
  }

  getNewTerm() {
    const tempTerms = [];
    firebase.database().ref('mime').once('value')
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const term = childSnapshot.key;
            const points = childSnapshot.val();

            tempTerms.push({ term, points });
          });
          this.setState({ terms: tempTerms });
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

  render() {
    if (this.state.start) {
      if (this.props.over) {
        return (
            <div>
              <h1>Mime-Game</h1>
              <h2>
                {this.props.user.username}: {this.props.user.points} points <span> | </span>
                 {this.props.opponent.username}: {this.props.opponent.points} points
              </h2>
              <Countdown timeRemaining={this.state.timeRemaining}/>
              <h3>Sorry, time is up!</h3>
            </div>
        );
      }
      return <div>
        <h1>Mime-Game</h1>
        <h2>
          {this.props.user.username}: {this.props.user.points} points <span> | </span>
           {this.props.opponent.username}: {this.props.opponent.points} points
        </h2>
        <Countdown timeRemaining={this.state.timeRemaining}/>

        <Call ref={call => (this.Call = call)}/>

        <p style={{ ...styles.term }}>{this.state.term.term}</p>
        <p className="error">{this.state.error}</p>


      </div>;
    }

    return <div>
      <h1>Mime-Game</h1>
      <h2>
        {this.props.user.username}: {this.props.user.points} points <span> | </span>
         {this.props.opponent.username}: {this.props.opponent.points} points
      </h2>
      <RaisedButton
          label="Start"
          labelPosition="before"
          style={styles.button}
          containerElement="label"
          onClick={ () => this.startCall(this.props.opponent.uid) }>
      </RaisedButton>
      <Call ref={call => (this.Call = call)}/>
    </div>;
  }
}
