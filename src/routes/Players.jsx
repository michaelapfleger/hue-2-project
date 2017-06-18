import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import firebase from './../firebase';
import { setUser, setOpponent } from './../actions';
import NewOpponent from './../components/NewOpponent.jsx';

const styles = {
  container: {
    padding: 10,
  },
  radioButton: {
    padding: 10,
    textAlign: 'left',
  },
};

@connect(store => ({
  user: store.user,
  opponent: store.opponent,
  newOpponent: store.newOpponent,
}))
export default class Players extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      users: [],
      defaultSelected: null,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.setOpponent = this.setOpponent.bind(this);
  }

  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
    newOpponent: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    this.getUsers();
  }

  handleNameChange(e) {
    this.setState({ username: e.target.value });
    const user = firebase.auth().currentUser;
    const value = e.target.value;
    console.log('success', user);

    user.updateProfile({
      displayName: value,
    })
        .then(() => {
          firebase.database().ref(`users/${user.uid}`).update({
            '/username': user.displayName,
          });

          const currentUser = {
            ...this.props.user,
            username: user.displayName,
          };

          this.props.dispatch(setUser(currentUser));
        })
        .catch(
        (error) => {
          this.setState({ error: error.message });
        });
  }

  getUsers() {
    const tempUsers = [];
    let name = '';
    let userID = '';
    firebase.database().ref('users').once('value')
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().online === true) {
              if (childSnapshot.val().opponent === 'none' || childSnapshot.val().opponent === this.props.user.uid) {
                name = childSnapshot.val().username;
                userID = childSnapshot.key;
                if (childSnapshot.val().uid !== this.props.user.uid) {
                  tempUsers.push({ userID, name });
                }
              }
            }
          });
          this.setState({ users: tempUsers });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
  }

  setOpponent(event, value) {
    let currentOpponent = {};
    // console.log('val', value);
    const oldOpponent = this.props.user.opponent;
    console.log('oldopponent', oldOpponent);
    if (value !== 'none') {
      firebase.database().ref(`/users/${value}`).once('value')
          .then((snapshot) => {
            currentOpponent = {
              username: snapshot.val().username,
              uid: snapshot.val().uid,
              points: snapshot.val().points,
            };

            console.log('eslint bla', currentOpponent);
          })
          .then(() => {
            firebase.database().ref(`users/${value}`).update({
              '/role': 'guesser',
              '/opponent': `${this.props.user.uid}`,
            });
            firebase.database().ref(`users/${this.props.user.uid}`).update({
              '/role': 'actor',
              '/opponent': `${value}`,
            });

            if (oldOpponent !== 'none') {
              firebase.database().ref(`users/${oldOpponent}`).update({
                '/role': 'none',
                '/opponent': 'none',
              });
            }
          })
          .then(() => {
            console.log('user', this.props.user);
            console.log('value', value);
            this.props.dispatch(setUser({ ...this.props.user, role: 'actor', opponent: value }));
          });
    } else if (oldOpponent !== null) {
      console.log('dont want an opponent');
      firebase.database().ref(`users/${this.props.user.opponent}`).update({
        '/role': 'none',
        '/opponent': 'none',
      }).then(() => {
        firebase.database().ref(`users/${this.props.user.uid}`).update({
          '/role': 'none',
          '/opponent': 'none',
        });
        this.props.dispatch(setOpponent({}));
        this.props.dispatch(setUser({ ...this.props.user, opponent: 'none', role: 'none' }));
      });
    }
  }

  render() {
    return <div>
      { this.props.newOpponent && <NewOpponent/> }
      <h1>Players</h1>
      <Paper style={styles.container}>
        <TextField
            defaultValue={this.props.user.username}
            floatingLabelText="Change your Username"
            onBlur={ this.handleNameChange }
            errorText={ this.state.error }
        /><br />
        <RadioButtonGroup name="users" onChange={this.setOpponent} valueSelected={this.props.user.opponent}>
          {this.state.users.map(user => <RadioButton value={user.userID}
                                                label={user.name}
                                                key={user.userID}
                                                style={styles.radioButton}
                                                />) }
          <RadioButton value='none'
                       label='dont want to play with anybody'
                       key='none'
                       style={styles.radioButton}
          />
        </RadioButtonGroup>
      </Paper>
    </div>;
  }
}
