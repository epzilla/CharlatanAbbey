'use strict';

var React = require('react');
var Stepper = require('./Stepper.jsx');

var FractionalStepper = React.createClass({

  getInitialState: function () {
    var initial = this.props.initialValue ? parseFloat(this.props.initialValue) : 6.0;
    var fullNumber = Math.floor(initial);
    var remainder = initial % 1;
    return {
      initialValue: initial,
      fullNumber: fullNumber,
      fraction: remainder
    };
  },

  componentDidMount: function () {
    this.props.onChange({
      full: true,
      amount: this.state.fullNumber
    });

    this.props.onChange({
      amount: this.state.fraction
    });
  },

  render: function () {

    var fullNumber = Math.floor(this.state.initialValue);
    var remainder = this.state.initialValue % 1;

    return (
      <section className='frac-stepper'>
        <Stepper full onChange={this.props.onChange} initialValue={fullNumber}/>
        <Stepper onChange={this.props.onChange} initialValue={remainder}/>
        <div className='frac-stepper-label'>
          <label>{this.props.label}</label>
        </div>
      </section>
    );
  }

});

module.exports = FractionalStepper;