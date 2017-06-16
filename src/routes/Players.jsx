import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import DataChannel from '../components/DataChannel.jsx';
import firebase from './../firebase';
import { setUser, setOpponent } from './../actions';

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
              name = childSnapshot.val().username;
              userID = childSnapshot.key;
              if (childSnapshot.val().uid !== this.props.user.uid) {
                tempUsers.push({ userID, name });
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

    firebase.database().ref(`/users/${value}`).once('value')
        .then((snapshot) => {
          currentOpponent = {
            username: snapshot.val().username,
            uid: snapshot.val().uid,
            points: snapshot.val().points,
          };
          this.props.dispatch(setOpponent(currentOpponent));
          this.setState({ defaultSelected:
              this.state.users.findIndex(x => x.userID === currentOpponent.uid),
          });
        })
        .then(() => {
          firebase.database().ref(`users/${value}`).update({
            '/role': 'guesser',
          });
          firebase.database().ref(`users/${this.props.user.uid}`).update({
            '/role': 'actor',
          });

          this.props.dispatch(setUser({ ...this.props.user, role: 'actor' }));
        });
  }

  render() {
    return <div>
      <h1>{this.constructor.name}</h1>
      <DataChannel ref={call => (this.DataChannel = call)}/>
      <Paper style={styles.container}>
        <TextField
            defaultValue={this.props.user.username}
            floatingLabelText="Change your Username"
            onBlur={ this.handleNameChange }
            errorText={ this.state.error }
        /><br />
        <RadioButtonGroup name="users" onChange={this.setOpponent}>
          {this.state.users.map(user => <RadioButton value={user.userID}
                                                label={user.name}
                                                key={user.userID}
                                                style={styles.radioButton}
                                                />) }
        </RadioButtonGroup>
      </Paper>
    </div>;
  }
}
