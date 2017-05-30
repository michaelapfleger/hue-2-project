import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import users from '../users';
import DataChannel from '../components/DataChannel.jsx';


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
      username: 'testuser',
    };
  }

  handleNameChange(e) {
    this.setState({ username: e.target.value });
  }

  render() {
    return <div>
      <h1>{this.constructor.name}</h1>
      <DataChannel ref={call => (this.DataChannel = call)}/>
      <Paper style={styles.container}>
        <TextField
            hintText={this.state.username}
            floatingLabelText="Change your Username"
            onChange={ this.handleNameChange }
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
