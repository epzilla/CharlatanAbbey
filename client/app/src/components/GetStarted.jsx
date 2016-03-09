/** @jsx React.DOM */
'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');
var Navigation = require('react-router').Navigation;

var GetStarted = React.createClass({
  mixins: [Navigation],

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListenter(this._onChange);
  },

  _lookUpBabies: function (e) {
    e.preventDefault();
    Actions.findBabies(this.state);
  },

  _setValue: function (e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    console.log(obj);
    this.setState(obj);
  },

  _onChange: function () {
    if (BabyStore.getSearchFailed()) {
      this.transitionTo('/get-started');
    } else {
      this.setState({
        babies: BabyStore.getBabies(),
        failedSearch: BabyStore.getSearchFailed()
      });
    }
  },

  render: function () {
    return (
      <form onSubmit={this._lookUpBabies} className="login-form">
        <h4>Hi there!</h4>
        <p>
          Let’s get started. Please enter the last name and birthdate of
          the babies you’d like to start tracking. If someone has already
          entered them into the system, you can start tracking them right
          away. If not, we’ll just ask you a few more questions to get things
          set up.
        </p>
        <input type="text" name="lastname" placeholder="Last Name" onChange={this._setValue} />
        <input type="date" name="birthdate" onChange={this._setValue} />
        <button>Submit</button>
      </form>
    );
  }
});

module.exports = GetStarted;
