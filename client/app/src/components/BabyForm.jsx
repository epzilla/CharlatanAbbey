/** @jsx React.DOM */
'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Wizard = require('./Wizard.jsx');

var First = React.createClass({
  _lookUpBabies: function (e) {
    e.preventDefault();
    alert('fdsafasd');
  },

  render: function () {
    return (
      <div>
        <h4>Hi there!</h4>
        <p>
          Let’s get started. Please enter the last name and birthdate of
          the babies you’d like to start tracking. If someone has already
          entered them into the system, you can start tracking them right
          away. If not, we’ll just ask you a few more questions to get things
          set up.
        </p>
        <input type="text" name="lastname" placeholder="Last Name" />
        <input type="date" name="birthdate" />
        <button onClick={this._lookUpBabies}>Submit</button>
      </div>
    );
  }
});

var Second = React.createClass({
  render: function() {
    return <div>Step 2</div>;
  }
});

var Third = React.createClass({
  render: function() {
    return <div>Step 3</div>;
  }
});

var BabyForm = React.createClass({
  getInitialState: function () {
    return {
      step: 0
    };
  },

  _submit: function (e) {
    e.preventDefault();
    alert('asdf');
  },

  render: function () {

    return (
      <Wizard
        onSubmit={this._submit}
        views={[
          <First />,
          <Second />,
          <Third />
        ]}
      />
    );
  }
});

module.exports = BabyForm;
