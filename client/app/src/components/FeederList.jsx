/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var Feeder = require('./Feeder.jsx');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');

var FeederList = React.createClass({
  getInitialState: function () {
    return {
      feeders: ['Mommy', 'Daddy', '']
    };
  },

  render: function () {
    _.map(this.state.feeders, function (feeder, i) {
      return <Feeder name={feeder} removable={i < this.state.feeders.length - 1} />;
    });
  }
});

module.exports = FeederList;
