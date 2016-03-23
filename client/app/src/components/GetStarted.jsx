/** @jsx React.DOM */
'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');
var Navigation = require('react-router').Navigation;
var FractionalStepper = require('./FractionalStepper.jsx');
var Wizard = require('./Wizard.jsx');
var FeederList = require('./FeederList.jsx');

var View1 = React.createClass({
  _setValue: function (e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.props.onChange(obj);
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
  _updateHours: function (val) {
    if (val.full) {
      this.props.onChange({
        fullHours: val.amount
      });
    } else {
      this.props.onChange({
        fracHours: val.amount
      });
    }
  },

  _updateOunces: function (val) {
    if (val.full) {
      this.props.onChange({
        fullOunces: val.amount
      });
    } else {
      this.props.onChange({
        fracOunces: val.amount
      });
    }
  },

  render: function () {

    return (
      <div className="get-started">
        <h3>Next, tell us about how often {this.props.initialState.babyA} and {this.props.initialState.babyB} usually eat/take a bottle.</h3>
        <div>
          <h4>About every</h4>
          <FractionalStepper
            onChange={this._updateHours}
            label="Hrs."
            initialValue={2}
          />
        </div>
        <h3>And how much milk/formula, on average, do they take per feeding?</h3>
        <div>
          <h4>About</h4>
          <FractionalStepper
            onChange={this._updateOunces}
            label="Oz."
            initialValue={4}
          />
        </div>
      </div>
    );
  }
});

var View3 = React.createClass({
  _onChange: function (val) {
    this.props.onChange({ feeders: val })
  },

  render: function () {

    return (
      <div className="get-started">
        <h3>Last, but not least, give us the names of a few people who will be taking care of them and might want to use this app.</h3>
        <FeederList
          onChange={this._onChange}
          feeders={this.props.initialState.feeders ? this.props.initialState.feeders : this.props.initialFeeders}
        />
      </div>
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
          <View1 initialState={this.state} onChange={this._setStateFromChildren}/>,
          <View2 initialState={this.state} onChange={this._setStateFromChildren}/>,
          <View3 initialState={this.state} initialFeeders={['Mommy', 'Daddy', '']}onChange={this._setStateFromChildren}/>
        ]}
      />
    );
  }
});

module.exports = GetStarted;
