import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import firebase from './../firebase';

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

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      error: '',
      info: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePWChange = this.handlePWChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePWChange(e) {
    this.setState({ password: e.target.value });
  }

  createUser() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.setState({ info: 'Your user is created. Please log in now' });
        })
        .catch(
        (error) => {
          this.setState({ error: error.message });
        });
  }

  loginUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.setState({ loggedIn: true });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
  }

  logoutUser() {
    firebase.auth().signOut().then(() => {
      this.setState({ loggedIn: false });
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
