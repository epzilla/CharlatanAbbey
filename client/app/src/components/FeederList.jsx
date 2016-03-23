/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var Feeder = require('./Feeder.jsx');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');

var FeederList = React.createClass({
  _addFeeder: function (e) {
    e.preventDefault();
    this.props.onChange(this.props.feeders.concat(''));
  },

  _removeFeeder: function (e) {
    e.preventDefault();
    var newList = _.reject(this.props.feeders, function (feeder) {
      return feeder === e.target.value;
    });
    this.props.onChange(newList);
  },

  _updateFeeders: function (e) {
    var i = e.target.getAttribute('data-index');
    var _feeders = _.clone(this.props.feeders);
    _feeders[i] = e.target.value;
    this.props.onChange(_feeders);
  },

  render: function () {
    var that = this;
    var feeders = _.map(this.props.feeders, function (feeder, i) {
      return (
        <Feeder
          name={feeder}
          removable={i < that.props.feeders.length - 1}
          add={that._addFeeder}
          key={feeder + i}
          index={i}
          remove={that._removeFeeder}
          onChange={that._updateFeeders}
        />
      );
    });

    return(
      <div>
        {feeders}
      </div>
    );
  }
});

module.exports = FeederList;
