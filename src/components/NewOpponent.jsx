import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

@connect(store => ({
  user: store.user,
  opponent: store.opponent,
}))
export default class NewOpponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }
  static propTypes = {
    user: PropTypes.object,
    opponent: PropTypes.object,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
          label="OK"
          primary={true}
          onTouchTap={this.handleClose}
      />];

    return <div>
      <Dialog
          title="New Opponent ..."
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
      >
        Another player selected you! Start the game now!
      </Dialog>
    </div>;
  }
}

