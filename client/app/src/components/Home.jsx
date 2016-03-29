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
    return _.isEmpty(this.state.babies) ? <LoginForm /> : <BabiesSummaryView babies={this.state.babies} />;
  }
});

module.exports = Home;
