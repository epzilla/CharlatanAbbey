var React = require('react');
var Stepper = require('./Stepper.jsx');
var TimeStepper = React.createClass({

  _setHours: function (e) {
    var newTime = this.state.time;
    var newHours = parseInt(e.amount);

    if (this.state.amPm === 'pm' && newHours < 12) {
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
    newTime.minutes(parseInt(e.amount));
    this.setState({
      time: newTime,
      minutes: e.amount
    }, function () {
      this.props.onChange(this.state.time);
    });
  },

  _setAmPm: function (e) {
    var newTime = this.state.time;
    var currentAmPm = newTime.format('a');
    if (e.target.value === 'pm') {
      newTime = currentAmPm === 'am' ? newTime.add(12, 'hours') : newTime;
    } else {
      newTime = currentAmPm === 'pm' ? newTime.subtract(12, 'hours') : newTime;
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
    var pm = t.format('a');

    if (pm === 'pm') {
      h -= 12;
    }

    return {
      time: this.props.time,
      hours: h,
      minutes: m,
      amPm: pm
    };
  },

  render: function () {

    return (
      <div>
        <Stepper full
          initialValue={this.state.hours}
          onChange={this._setHours}
          max={12}
          min={1}
          wrap={true}/>
        <span className='big-colon'></span>
        <Stepper full
          initialValue={this.state.minutes}
          onChange={this._setMins}
          padSingleDigits={true}
          max={59}
          min={0}
          wrap={true}/>
        <div className='ampm'>
          <span className='switch'>
            <input type='radio' name={'pm' + this.props.identifier} onChange={this._setAmPm} defaultChecked={this.state.amPm === 'am'} value='am'/>
            <label>AM</label>
          </span>
          <span className='switch'>
            <input type='radio' name={'pm' + this.props.identifier} onChange={this._setAmPm} defaultChecked={this.state.amPm === 'pm'} value='pm' />
            <label>PM</label>
          </span>
        </div>
      </div>
    );
  }

});

module.exports = TimeStepper;