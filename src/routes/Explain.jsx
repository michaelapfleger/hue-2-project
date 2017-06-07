import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
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

export default class Explain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: 'tami',
      user2: 'Michi',
      term: {},
      terms: [],
      error: '',
      timeRemaining: 20,
      nameInput: '',
      name: '',
    };
  }

  componentDidMount() {
    this.getNewTerm();
  }

  nameInput(input) {
    this.setState({
      nameInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
    });
  }

  setName(evt) {
    if (evt) {
      evt.preventDefault();
    }
    send('join', 'all', this.state.nameInput);
    this.setState({
      name: this.state.nameInput,
    });
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
    return <div>
      <h1>Explain-Game</h1>
      <h2>{ this.state.user1 }: XX points | { this.state.user2 }: XX points</h2>
      <Countdown timeRemaining={this.state.timeRemaining}/>

      <Paper style={styles.container}>
        <form onSubmit={evt => this.setName(evt)}>
          <TextField floatingLabelText="Enter a username"
                     fullWidth={true}
                     value={this.state.nameInput}
                     onChange={(e, v) => this.nameInput(v)}/>
          <RaisedButton label="Start Chat"
                        primary={true}
                        disabled={!this.state.nameInput}
                        onTouchTap={() => this.setName()}/>
        </form>
      </Paper>

      <a href="#"
         style={styles.name}
         onClick={() => this.startCall(this.state.user1)}>
        {this.state.user1}
      </a>

      <Call ref={call => (this.Call = call)}/>

      <p style={{ ...styles.term }}>{this.state.term.term}</p>
      <p className="error">{this.state.error}</p>


    </div>;
  }
}
