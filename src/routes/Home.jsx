import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import firebase from './../firebase';

import { setUser } from './../actions';

const styles = {
  button: {
    margin: 12,
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
}))

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      error: '',
      info: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePWChange = this.handlePWChange.bind(this);
  }

  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`/users/${user.uid}`).once('value')
            .then((snapshot) => {
              const currentUser = {
                username: snapshot.val().username,
                uid: snapshot.val().uid,
                points: snapshot.val().points,
                online: true,
                role: snapshot.val().role,
              };
              this.props.dispatch(setUser(currentUser));
            });
        this.setState({ loggedIn: true });
      }
    });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePWChange(e) {
    this.setState({ password: e.target.value });
  }

  createUser() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
          this.setState({ info: 'Your user is created. Please log in now' });
          user.updateProfile({
            displayName: user.email,
          }).then();

          console.log('new uid', user.uid);
          firebase.database().ref(`users/${user.uid}`).set({
            online: false,
            uid: user.uid,
            username: user.email,
            points: 0,
            role: 'none',
          });
        })
        .catch(
        (error) => {
          this.setState({ error: error.message });
        });
  }

  loginUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          const test = firebase.auth().currentUser;
          console.log('user', test);

          const currentUser = {
            email: this.state.email,
            username: test.displayName,
            uid: test.uid,
            online: true,
          };
          this.setState({ loggedIn: true });
          this.props.dispatch(setUser(currentUser));

          firebase.database().ref(`users/${this.props.user.uid}`).update({
            '/online': true,
          });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
  }

  logoutUser() {
    firebase.database().ref(`users/${this.props.user.uid}`).update({
      '/online': false,
    });

    firebase.auth().signOut().then(() => {
      this.setState({ loggedIn: false });
      const currentUser = { };
      this.props.dispatch(setUser(currentUser));
    }).catch((error) => {
      this.setState({ error: error.message });
    });
  }

  render() {
    return <div>
      <img src="./logo.png" width="200"/>
      <h1>Welcome</h1>
      <div style={{ display: this.state.loggedIn ? 'none' : 'block' }}>
        <p>{this.state.info}</p>
        <TextField
            hintText={this.state.email}
            floatingLabelText="Please enter your Email"
            onChange={ this.handleEmailChange }
        /><br />
        <TextField
            floatingLabelText="Please enter your Password"
            onChange={ this.handlePWChange }
            type="password"
            errorText={ this.state.error }
        /><br />
        <RaisedButton
            label="SignUp"
            labelPosition="before"
            style={styles.button}
            containerElement="label"
        >
          <input type="submit" style={styles.exampleImageInput} onClick={ () => this.createUser() }/>
        </RaisedButton>

        <RaisedButton
            label="Login"
            labelPosition="before"
            style={styles.button}
            containerElement="label"
        >
          <input type="submit" style={styles.exampleImageInput} onClick={ () => this.loginUser() }/>
        </RaisedButton>
      </div>

      <div style={{ display: this.state.loggedIn ? 'block' : 'none' }}>
        <RaisedButton
            label="Logout"
            labelPosition="before"
            style={styles.button}
            containerElement="label"
        >
          <input type="submit" style={styles.exampleImageInput} onClick={ () => this.logoutUser() }/>
        </RaisedButton>
      </div>

    </div>;
  }
}
