import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import Countdown from './../components/Countdown.jsx';
import firebase from './../firebase';

import Call from '../components/CallAudio.jsx';
import { send } from '../ws';

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
export default class Explain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: {},
      terms: [],
      error: '',
      timeRemaining: 20,
      start: false,
    };
  }

  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
    over: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.getNewTerm();
    send('join', 'all', this.props.user.uid);
  }

  startCall(name) {
    this.Call.startCall(name);
  }

  getNewTerm() {
    const tempTerms = [];
    firebase.database().ref('explain').once('value')
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

  render() {
    if (this.state.start) {
      if (this.props.over) {
        return (
            <div>
              <h1>Explain-Game</h1>
              <h2>
                {this.props.user.username}: XX points | {this.props.opponent.username}: XX points
              </h2>
              <Countdown timeRemaining={this.state.timeRemaining}/>
              <h3>Sorry, time is up!</h3>
            </div>
        );
      }
      return <div>
        <h1>Explain-Game</h1>
        <h2>
          { this.props.user.username }: XX points | { this.props.opponent.username }: XX points
        </h2>
        <Countdown timeRemaining={this.state.timeRemaining}/>

        <Call ref={call => (this.Call = call)}/>

        <p style={{ ...styles.term }}>{this.state.term.term}</p>
        <p className="error">{this.state.error}</p>


      </div>;
    }

    return <div>
      <h1>Explain-Game</h1>
      <h2>
        { this.props.user.username }: XX points | { this.props.opponent.username }: XX points
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
