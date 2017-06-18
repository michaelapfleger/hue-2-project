import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { setNewOpponent } from './../actions';


@connect(store => ({
  user: store.user,
  opponent: store.opponent,
  newOpponent: store.newOpponent,
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
    newOpponent: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.dispatch(setNewOpponent(false));
  };

  render() {
    const actions = [
      <FlatButton
          label="OK"
          primary={true}
          onTouchTap={this.handleClose}
      />];

    if (this.props.opponent.username !== '') {
      return <div>
        <Dialog
            title="New Opponent ..."
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
        >
          Another player selected you! Start the game now with {this.props.opponent.username} !
        </Dialog>
      </div>;
    }
    return <div></div>;
  }
}

