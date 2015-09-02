var React = require('react');
var cx = require('classnames');

var StepperBtn = React.createClass({

  render: function () {
    var btnClasses = cx({
      'btn': true,
      'btn-invert': true,
      'stepper-btn': true,
      'top-btn': this.props.btnPos === 'top',
      'bottom-btn': this.props.btnPos === 'bottom'
    });

    var iClass = cx({
      'fa': true,
      'fa-angle-up': this.props.btnPos === 'top',
      'fa-angle-down': this.props.btnPos === 'bottom'
    });

    var dir = this.props.btnPos === 'top' ? 'up' : 'down';

    return (
      <button className={btnClasses} data-direction={dir} onClick={this.props.onClick}>
        <i className={iClass}></i>
      </button>
    );
  }
});

var Stepper = React.createClass({

  _fractionalPointer: 0,
  _fractions: [
    {
      displayValue: '--',
      actualValue: 0
    },
    {
      displayValue: '¼',
      actualValue: 0.25
    },
    {
      displayValue: '⅓',
      actualValue: 0.33
    },
    {
      displayValue: '½',
      actualValue: 0.5
    },
    {
      displayValue: '⅔',
      actualValue: 0.66
    },
    {
      displayValue: '¾',
      actualValue: 0.75
    }
  ],

  _stepDown: function (e) {
    e.preventDefault();
    return this.props.full ? this._stepDownFull() : this._stepDownFractional();
  },

  _stepUp: function (e) {
    e.preventDefault();
    return this.props.full ? this._stepUpFull() : this._stepUpFractional();
  },

  _stepUpFull: function () {
    var curVal = parseInt(this.state.val);

    if (this.props.max !== undefined && curVal === this.props.max) {
      if (this.props.wrap) {
        curVal = this.props.min;
      }
    } else {
      curVal++;
    }

    if (this.props.padSingleDigits && curVal < 10) {
      curVal = '0' + curVal;
    }

    this.setState({
      val: curVal
    });
    this.props.onChange({
      full: true,
      amount: curVal
    });
  },

  _stepUpFractional: function () {
    var fracPointer = this.state.fraction;

    if (fracPointer !== 5) {
      fracPointer++;
    } else {
      fracPointer = 0;
    }

    this.setState({
      fraction: fracPointer,
      val: this._fractions[fracPointer].displayValue
    });
    this.props.onChange({
      full: false,
      amount: this._fractions[fracPointer]
    });
  },

  _stepDownFull: function () {
    var curVal = parseInt(this.state.val);

    if (this.props.min !== undefined && curVal === this.props.min) {
      if (this.props.wrap) {
        curVal = this.props.max;
      }
    } else {
      curVal--;
    }

    if (this.props.padSingleDigits && curVal < 10) {
      curVal = '0' + curVal;
    }

    this.setState({
      val: curVal
    });
    this.props.onChange({
      full: true,
      amount: curVal
    });
  },

  _stepDownFractional: function () {
    var fracPointer = this.state.fraction;

    if (fracPointer !== 0) {
      fracPointer--;
    } else {
      fracPointer = 5;
    }

    this.setState({
      fraction: fracPointer,
      val: this._fractions[fracPointer].displayValue
    });
    this.props.onChange({
      full: false,
      amount: this._fractions[fracPointer]
    });
  },

  getInitialState: function () {
    if (this.props.full) {
      var val = this.props.initialValue ? this.props.initialValue : 2;
      if (this.props.padSingleDigits && val < 10) {
        val = '0' + val;
      }
      return {
        val: val,
        fraction: 0
      };
    } else if (this.props.initialValue === 0.25) {
        return {
          val: '¼',
          fraction: 1
        };
    } else if (this.props.initialValue === 0.5) {
      return {
        val: '½',
        fraction: 3
      };
    } else if (this.props.initialValue === 0.75) {
      return {
        val: '¾',
        fraction: 5
      };
    } else if (this.props.initialValue > 0.5) {
      return {
        val: '⅔',
        fraction: 4
      };
    } else if (this.props.initialValue > 0.25) {
      return {
        val: '⅓',
        fraction: 2
      };
    } else {
      return {
        val: '--',
        fraction: 0
      };
    }
  },

  render: function () {
    var full = this.props.full;
    var classes = cx({
      'stepper': true,
      'stepper-full': full,
      'stepper-fractional': !full
    });

    return (
      <div className={classes}>
        <StepperBtn btnPos='top' onClick={this._stepUp}/>
        <span>{this.state.val}</span>
        <StepperBtn btnPos='bottom' onClick={this._stepDown}/>
      </div>
    );
  }
});

module.exports = Stepper;