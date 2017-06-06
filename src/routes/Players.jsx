import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import users from '../users';
import DataChannel from '../components/DataChannel.jsx';
import firebase from './../firebase';


const styles = {
  container: {
    padding: 10,
  },
  radioButton: {
    padding: 10,
    textAlign: 'left',
  },
};


export default class Players extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.setState({ username: user.displayName });
  }

  handleNameChange(e) {
    this.setState({ username: e.target.value });
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: e.target.value,
    })
        .then(() => {
          console.log('success');
        })
        .catch(
        (error) => {
          this.setState({ error: error.message });
        });
  }

  render() {
    return <div>
      <h1>{this.constructor.name}</h1>
      <DataChannel ref={call => (this.DataChannel = call)}/>
      <Paper style={styles.container}>
        <TextField
            value={this.state.username}
            floatingLabelText="Change your Username"
            onBlur={ this.handleNameChange }
            errorText={ this.state.error }
        /><br />
        <RadioButtonGroup name="users"
                          onChange={(e, value) => this.setStation(value)}>
          {users.map(user => <RadioButton value={user.name}
                                                label={user.name}
                                                key={user.id}
                                                style={styles.radioButton}/>) }
        </RadioButtonGroup>
      </Paper>
    </div>;
  }
}
