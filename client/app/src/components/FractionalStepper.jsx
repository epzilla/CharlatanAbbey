'use strict';

import React from 'react';
import Stepper from './Stepper.jsx';

const FractionalStepper = React.createClass({

  getInitialState: function () {
    let initial = this.props.initialValue ? parseFloat(this.props.initialValue) : 6.0;
    let fullNumber = Math.floor(initial);
    let remainder = initial % 1;
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

    let fullNumber = Math.floor(this.state.initialValue);
    let remainder = this.state.initialValue % 1;

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

export default FractionalStepper;