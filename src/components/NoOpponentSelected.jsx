import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
  },
};

@connect(store => ({
  over: store.over,
  user: store.user,
}))
export default class NoOpponentSelected extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func,
  };

  render() {
    return <div>
      <h1>Sorry {this.props.user.username}</h1>
      <Paper style={styles.container}>
        <p>
          To start the game you first have to select a partner. Please go to Players an choose one.
        </p>
        <RaisedButton label="Go to players"
                      primary={true}
                      href='/players'/>
      </Paper>
    </div>;
  }
}

