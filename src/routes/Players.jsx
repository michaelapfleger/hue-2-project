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
            if (childSnapshot.val().online === 0) {
              name = childSnapshot.val().username;
            }

            userID = childSnapshot.key;
            if (childSnapshot.val().uid !== this.props.user.uid) {
              tempUsers.push({ userID, name });
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
        });
  }

  render() {
    let index = -1;
    if (this.state.users && this.props.opponent) {
      index = this.state.users.findIndex(x => x.userID === this.props.opponent.userID);
      console.log('index', index);
    }
    return <div>
      <h1>{this.constructor.name}</h1>
      <DataChannel ref={call => (this.DataChannel = call)}/>
      <TextField
          defaultValue={this.props.user.username}
          floatingLabelText="Change your Username"
          onBlur={ this.handleNameChange }
          errorText={ this.state.error }
      /><br />
      <Paper style={styles.container}>
        <p>Choose your opponent for your next game!</p>
        <RadioButtonGroup name="users" onChange={this.setOpponent} defaultSelected={ index }>
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
