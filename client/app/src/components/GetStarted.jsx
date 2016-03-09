/** @jsx React.DOM */
'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');
var Navigation = require('react-router').Navigation;
var Wizard = require('./Wizard.jsx');

var View1 = React.createClass({
  render: function () {

    return (
      <div className="get-started">
        <h3>First things first. What are their names?</h3>
        <input type="text" placeholder="Last Name" onChange={this._setLastname} />
        <input type="text" placeholder="Baby A" onChange={this._setBabyA} />
        <input type="text" placeholder="Baby B" onChange={this._setBabyB} />
      </div>
    );
  }
});

var View2 = React.createClass({
  render: function () {

    return (
      <div></div>
    );
  }
});

var View3 = React.createClass({
  render: function () {

    return (
      <div></div>
    );
  }
});

var GetStarted = React.createClass({
  mixins: [Navigation],

  render: function () {
    return (
      <Wizard
        views={[
          <View1 />,
          <View2 />,
          <View3 />
        ]}
      />
    );
  }
});

module.exports = GetStarted;
