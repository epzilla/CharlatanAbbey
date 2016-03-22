/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var ls = require('../utils/local-storage');
var BabyStore = require('../stores/baby-store');
var LoginForm = require('./LoginForm.jsx');
var BabiesSummaryView = require('./BabiesSummaryView.jsx');

var Home = React.createClass({
  getInitialState: function () {
    return {
      babies: ls.get('babies')
    };
  },

  _onChange: function () {
    this.setState({
      babies: BabyStore.getBabies()
    });
  },

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (!_.isEmpty(this.state.babies)) {
      return (
        <BabiesSummaryView babies={this.state.babies} />
      );
    }

    return (
      <LoginForm />
    );
  }
});

module.exports = Home;
