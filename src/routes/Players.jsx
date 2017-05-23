import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import users from '../users';


const styles = {
  container: {
    padding: 10,
  },
  radioButton: {
    padding: 10,
  },
};


export default class Players extends React.Component {
  render() {
    return <div>
      <h1>{this.constructor.name}</h1>
      <Paper style={styles.container}>
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
