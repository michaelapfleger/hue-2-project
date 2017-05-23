import React from 'react';
import Immutable from 'immutable';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/action/delete-forever';
import Yellow from 'material-ui/svg-icons/image/colorize';

import Drawing from './Drawing.jsx';


export default class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      color: '#ffffff',
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

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
    }));
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
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  clearCanvas() {
    this.setState({ lines: new Immutable.List() });
  }
  changeColor() {
    this.setState({ color: '#00bcd4' });
  }

  render() {
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
            <Yellow />
          </IconButton>
        </div>
    );
  }
}
