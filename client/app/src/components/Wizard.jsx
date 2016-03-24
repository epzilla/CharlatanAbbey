/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var Actions = require('../actions/view-actions');
var WizardStore = require('../stores/wizard-store');

var Wizard = React.createClass({
  getInitialState: function () {
    var initialState = this.props.initialState || {};
    return _.assign(initialState, WizardStore.getAll());
  },

  componentDidMount: function () {
    WizardStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    WizardStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(WizardStore.getAll());
  },

  _next: function (e) {
    e.preventDefault();
    Actions.wizardNext();
  },

  _prev: function (e) {
    e.preventDefault();
    Actions.wizardPrev();
  },

  render: function () {
    var currentView = this.props.views[this.state.step];
    var nextBtn = currentView.props.onFinish ?
      <button onClick={currentView.props.onFinish}>Done</button> :
      <button onClick={this._next} disabled={this.state.step === this.props.views.length - 1}>Next</button>;

    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.views[this.state.step]}
        <button onClick={this._prev} disabled={this.state.step === 0}>Back</button>
        {nextBtn}
      </form>
    );
  }
});

module.exports = Wizard;
