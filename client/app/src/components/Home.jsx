/** @jsx React.DOM */
'use strict';

var React = require('react');
var ls = require('../utils/local-storage');
var BabyStore = require('../stores/baby-store');
var BabyForm = require('./BabyForm.jsx');
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
    if (this.state.babies) {
      return (
        <BabiesSummaryView babies={this.state.babies} />
      );
    }

    return (
      <BabyForm />
    );
  }
});

module.exports = Home;
