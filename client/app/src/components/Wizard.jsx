/** @jsx React.DOM */
'use strict';

var React = require('react');

var Wizard = React.createClass({
  getInitialState: function () {
    return {
      step: 0
    };
  },

  _next: function (e) {
    e.preventDefault();
    this.setState({
      step: this.state.step + 1
    });
  },

  _prev: function (e) {
    e.preventDefault();
    this.setState({
      step: this.state.step - 1
    });
  },

  render: function () {

    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.views[this.state.step]}
        <button onClick={this._prev} disabled={this.state.step === 0}>Back</button>
        <button onClick={this._next} disabled={this.state.step === this.props.views.length - 1}>Next</button>
      </form>
    );
  }
});

module.exports = Wizard;
