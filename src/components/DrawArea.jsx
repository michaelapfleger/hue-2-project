import React from 'react';
import PropTypes from 'prop-types';
import Immutable, { fromJS } from 'immutable';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/action/delete-forever';
import Yellow from 'material-ui/svg-icons/image/colorize';
import { on, off, send } from '../ws';
// import Line from './Line.jsx';
import Drawing from './Drawing.jsx';


export default class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      color: '#25737c',
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  static propTypes = {
    user: PropTypes.object,
  };

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }

    const point = this.relativeCoordinates(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true,
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinates(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
    }), () => {
      this.sendMessage(this.state.lines);
    });
  }
  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinates(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);

    const id = Math.round(Math.random() * 100000000000).toString(36);
    send('join', 'all', id);
    on('chat', (from, payload) => {
      this.setState({
        lines: new Immutable.List(fromJS(payload)),
      });
    });
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    off('chat');
  }

  sendMessage(lines) {
    send('chat', 'all', lines);

    this.setState({
      lines,
    });
  }
  clearCanvas() {
    this.setState({ lines: new Immutable.List() });
  }
  changeColor() {
    if (this.state.color === '#DE0670') {
      this.setState({ color: '#25737c' });
    } else {
      this.setState({ color: '#DE0670' });
    }
  }

  render() {
    if (this.props.user && this.props.user.role === 'actor') {
      return (
          <div>
            <div
                className="drawArea"
                ref="drawArea"
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >
              <span className="draw-info" style={{ display: this.state.isDrawing ? 'none' : 'block' }}>draw here ...</span>

              <Drawing lines={this.state.lines} color={this.state.color} />

            </div>
            <IconButton
                tooltip="clear all"
                tooltipPosition="bottom-center"
                onTouchTap={() => this.clearCanvas()}
            >
              <ActionClear />
            </IconButton>

            <IconButton
                tooltip="change color"
                tooltipPosition="bottom-center"
                onTouchTap={() => this.changeColor()}
            >
              <Yellow/>
            </IconButton>
          </div>
      );
    }
    if (this.props.user && this.props.user.role === 'guesser') {
      return (
          <div>
            <div
                className="drawArea"
                ref="drawArea">
              <Drawing lines={this.state.lines} color={this.state.color} />
            </div>
          </div>
      );
    }
    return (<div></div>);
  }
}
