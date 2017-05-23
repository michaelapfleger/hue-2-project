import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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
      username: 'pink_unicorn',
    };
  }

  render() {
    return <div>
      <img src="./logo.png" width="200"/>
      <h1>Welcome</h1>
      <TextField
          hintText={this.state.username}
          floatingLabelText="Please enter your Username"
      /><br />
      <RaisedButton
          label="Login"
          labelPosition="before"
          style={styles.button}
          containerElement="label"
      >
        <input type="submit" style={styles.exampleImageInput} />
      </RaisedButton>
    </div>;
  }
}
