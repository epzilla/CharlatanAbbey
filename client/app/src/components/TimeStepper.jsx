var React = require('react');
var Stepper = require('./Stepper.jsx');
var moment = require('moment-timezone');
var TimeStepper = React.createClass({

  _setHours: function (e) {
    var newTime = this.state.time;
    var newHours = e.amount;

    if (this.state.amPm === 'pm' && newHours > 12) {
      newHours += 12;
    }

    newTime.hours(newHours);

    this.setState({
      time: newTime,
      hours: newHours
    }, function () {
      this.props.onChange(this.state.time);
    });
  },

  _setMins: function (e) {
    var newTime = this.state.time;
    newTime.minutes(e.amount);
    this.setState({
      time: newTime,
      minutes: e.amount
    }, function () {
      this.props.onChange(this.state.time);
    });
  },

  _setAmPm: function (e) {
    var newTime = this.state.time;
    if (e.target.value === 'pm') {
      newTime = newTime.add(12, 'hours');
    } else {
      newTime = newTime.subtract(12, 'hours');
    }

    this.setState({
      time: newTime,
      amPm: e.target.value
    }, function () {
      this.props.onChange(this.state.time);
    });
  },

  getInitialState: function () {
    var t = this.props.time;
    var h = t.hours();
    var m = t.minutes();
    var pm = t.format('a') === 'pm';

    if (pm) {
      h -= 12;
    }

    return {
      time: this.props.time,
      hours: h,
      minutes: m,
      pm: pm
    };
  },

  render: function () {

    return (
      <div>
        <Stepper full initialValue={this.state.hours} onChange={this._setHours} />
        <span className='big-colon'></span>
        <Stepper full initialValue={this.state.minutes} onChange={this._setMins}/>
        <div className='ampm'>
          <span className='switch'>
            <input type='radio' name='pm' onChange={this._setAmPm} defaultChecked={!this.state.pm} value='am'/>
            <label>AM</label>
          </span>
          <span className='switch'>
            <input type='radio' name='pm' onChange={this._setAmPm} defaultChecked={this.state.pm} value='pm' />
            <label>PM</label>
          </span>
        </div>
      </div>
    );
  }

});

module.exports = TimeStepper;