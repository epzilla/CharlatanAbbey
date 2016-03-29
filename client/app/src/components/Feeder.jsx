'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const Feeder = React.createClass({

  handleSubmit: function (e) {
    e.preventDefault();
    let val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy(e);
    }
  },

  handleEdit: function () {
    this.props.onEdit();
    this.setState({editText: this.props.feeder.name});
  },

  handleKeyDown: function (e) {
    if (e.which === ESCAPE_KEY) {
      this.setState({editText: this.props.feeder.name});
      this.props.onCancel(e);
    } else if (e.which === ENTER_KEY) {
      this.handleSubmit(e);
    }
  },

  handleChange: function (e) {
    if (this.props.editing) {
      this.setState({editText: e.target.value});
    }
  },

  getInitialState: function () {
    return {editText: this.props.feeder.name};
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return (
      nextProps.feeder !== this.props.feeder ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  },

  componentDidUpdate: function (prevProps) {
    if (!prevProps.editing && this.props.editing) {
      let node = ReactDOM.findDOMNode(this.refs.editField);
      node.focus();
      node.setSelectionRange(0, node.value.length);
    }
  },

  render: function () {
    let that = this;

    return (

      <li className={cx({
        editing: this.props.editing
      })}>
        <div className="view">
          <label onClick={this.handleEdit} onTouchEnd={function (e) {
            e.preventDefault();
            e.stopPropagation();
            that.handleEdit();
          }}>
            {this.props.feeder.name}
          </label>
          <button className="btn btn-destroy" onClick={this.props.onDestroy}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
});

export default Feeder;
