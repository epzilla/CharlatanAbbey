/** @jsx React.DOM */
'use strict';

var React = require('react');
var Stepper = require('./Stepper.jsx');

var OunceStepper = React.createClass({

  getInitialState: function () {
    return {
      initialValue: this.props.initialValue || 2.0
    };
  },

  render: function () {

    var fullNumber = Math.floor(this.state.initialValue);
    var remainder = this.state.initialValue % 1;

    return (
      <section className='ounce-stepper'>
        <Stepper full onChange={this.props.onChange} initialValue={fullNumber}/>
        <Stepper onChange={this.props.onChange} initialValue={remainder}/>
        <div className='ounce-label'>
          <label>Oz.</label>
        </div>
      </section>
    );
  }

});

module.exports = OunceStepper;