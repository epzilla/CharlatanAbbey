/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var Feeder = require('./Feeder.jsx');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');
var uuid = require('../utils/uuid');

var ENTER_KEY = 13;

var FeederList = React.createClass({

  getInitialState: function () {
    return {
      editing: null,
      feeders: this.props.feeders || [],
      newFeeder: ''
    };
  },

  _add: function (e) {
    e.preventDefault();
    var id = uuid.getUUID();
    this.setState({
      feeders: this.state.feeders.concat({
        id: id,
        name: ''
      })
    }, function () {
      this.setState({
        editing: id
      })
    });
  },

  _destroy: function (feeder, e) {
    e.preventDefault();
    this.setState({
      feeders: _.reject(this.state.feeders, {id: feeder.id})
    }, function () {
      this.props.onChange(this.state.feeders);
    });
  },

  _edit: function (feeder) {
    this.setState({editing: feeder.id}, function () {
      console.log(this.state);
    });
  },

  _save: function (feederToSave, text) {
    // this.props.model.save(feederToSave, text);
    //TODO save
    this.setState({
      editing: null,
      feeders: _.map(this.state.feeders, function (feeder) {
        return feeder !== feederToSave ? feeder : {id: feeder.id, name: text};
      })
    }, function () {
      this.props.onChange(this.state.feeders);
    });
  },

  _cancel: function () {
    this.setState({editing: null}, function () {
      console.log(this.state);
    });
  },

  render: function () {
    var that = this;
    var feeders = _.map(this.state.feeders, function (feeder) {
      return (
        <Feeder
          feeder={feeder}
          onDestroy={that._destroy.bind(that, feeder)}
          onEdit={that._edit.bind(that, feeder)}
          editing={that.state.editing === feeder.id}
          onSave={that._save.bind(that, feeder)}
          onCancel={that._cancel}
          key={feeder.id}
        />
      );
    });

    return(
      <div>
        <ul>
          {feeders}
        </ul>
        <button onClick={this._add}>+</button>
      </div>
    );
  }
});

module.exports = FeederList;

