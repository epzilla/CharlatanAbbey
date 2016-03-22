/** @jsx React.DOM */
'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');
var Navigation = require('react-router').Navigation;
var FractionalStepper = require('./FractionalStepper.jsx');
var Wizard = require('./Wizard.jsx');

var View1 = React.createClass({
  _setValue: function (e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.props.setParentState(obj);
  },

  render: function () {

    return (
      <div className="get-started">
        <h3>First things first. What are their names?</h3>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            defaultValue={this.props.initialState ? this.props.initialState.lastname : ''}
            onChange={this._setValue}
          />
        </div>
        <div>
          <label htmlFor="babyA">Baby A</label>
          <input type="text" name="babyA" placeholder="First Name" onChange={this._setValue} />
        </div>
        <div>
          <label htmlFor="babyB">Baby B</label>
          <input type="text" name="babyB" placeholder="First Name" onChange={this._setValue} />
        </div>
      </div>
    );
  }
});

var View2 = React.createClass({
  _onChange: function (val) {
    if (val.full) {
      this.setState({
        fullHours: val.amount
      }, function () {
        console.log(this.state);
      });
    } else {
      this.setState({
        fracHours: val.amount
      }, function () {
        console.log(this.state);
      });
    }
  },

  render: function () {

    return (
      <div className="get-started">
        <h3>Next, tell us about how often they usually eat/take a bottle.</h3>
        <div>
          <span>About every </span>
          <FractionalStepper
            onChange={this._onChange}
            label="Hrs."
            initialValue={2}
          />
          <span> hours</span>
        </div>
      </div>
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

  getInitialState: function () {
    return this.props.query;
  },

  _setStateFromChildren: function (state) {
    this.setState(state, function () {
      console.log(this.state);
    });
  },

  render: function () {
    return (
      <Wizard
        initialState={this.props.query}
        views={[
          <View1 initialState={this.state} setParentState={this._setStateFromChildren}/>,
          <View2 initialState={this.state} setParentState={this._setStateFromChildren}/>,
          <View3 initialState={this.state} setParentState={this._setStateFromChildren}/>
        ]}
      />
    );
  }
});

module.exports = GetStarted;
