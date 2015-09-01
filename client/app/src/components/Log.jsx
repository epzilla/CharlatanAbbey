/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var State = Router.State;
var Navigation = Router.Navigation;
var FeederStore = require('../stores/feeder-store');
var EventStore = require('../stores/event-store');
var Actions = require('../actions/view-actions');
var _ = require('lodash');
var moment = require('moment-timezone');
var OunceStepper = require('./OunceStepper.jsx');

var Log = React.createClass({

  mixins: [ State, Navigation ],

  _submit: function (e) {
    e.preventDefault();

    this.setState({
      submitting: true
    });

    Actions.submitEventForm({
      name: this.state.baby,
      eventType: this.state.eventType,
      burp: this.state.burp,
      diaper: this.state.diaper.join(' + '),
      feeder: this.state.feeder,
      time: moment(new Date()).subtract(parseInt(this.state.time), 'minutes').format(),
      amount: this.state.fullAmount + this.state.fracAmount,
      medicine: this.state.medicine.join(', '),
      spit: this.state.spit
    });
  },

  _setEventType: function (e) {
    this.setState({
      eventType: e.target.value
    });
  },

  _setEventTime: function (e) {
    this.setState({
      time: parseInt(e.target.value)
    });
  },

  _setAmount: function (val) {
    if (val.full) {
      this.setState({
        fullAmount: val.amount
      });
    } else {
      this.setState({
        fracAmount: val.amount.actualValue
      });
    }
  },

  _setFeeder: function (e) {
    this.setState({
      feeder: e.target.value
    });
  },

  _setBurp: function (e) {
    this.setState({
      burp: e.target.value
    });
  },

  _setMeds: function (e) {
    var meds = this.state.medicine;
    var val = e.target.value;

    if (_.contains(meds, val)) {
      meds = _.without(meds, val);
    } else {
      meds.push(val);
    }

    this.setState({
      medicine: meds
    });
  },

  _setDiaper: function (e) {
    var diapers = this.state.diaper;
    var val = e.target.value;

    if (_.contains(diapers, val)) {
      diapers = _.without(diapers, val);
    } else {
      diapers.push(val);
    }

    this.setState({
      diaper: diapers
    });
  },

  _setSpit: function (e) {
    this.setState({
      spit: e.target.value
    });
  },

  _onChange: function () {
    this.transitionTo('/');
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      fullAmount: 2,
      fracAmount: 0,
      feeders: FeederStore.getFeeders(),
      medicine: [],
      diaper: ['wet'],
      time: 30,
      burp: 'big',
      spit: 'no',
      eventType: 'feeding',
      baby: this.props.params.name
    };
  },

  render: function () {
    var that = this;
    var baby = this.props.params.name;
    var ounceField, feederField, medField, burpField, diaperField, spitField;

    if (this.state.eventType === 'feeding') {
      ounceField = (
        <div className='pad-bottom-1em ounce-field'>
          <h3>How much did she eat?</h3>
          <OunceStepper onChange={this._setAmount} />
        </div>
      );

      var feeders = _.map(this.state.feeders, function (f) {
        return (
          <span className='switch' key={f.name}>
            <input type='radio' name='feeder' onChange={that._setFeeder} value={f.name}/>
            <label>{f.name}</label>
          </span>
        );
      });

      feederField = (
        <div className='pad-bottom-1em feeder-field'>
          <h3>Who fed her?</h3>
          <div>
            {feeders}
          </div>
        </div>
      );
    }

    if (this.state.eventType === 'feeding' || this.state.eventType === 'burp') {
      burpField = (
        <div className='pad-bottom-1em burp-field'>
          <h3>Any burp?</h3>
          <div>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} defaultChecked value='big'/>
              <label>Big</label>
            </span>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} value='small' />
              <label>Small</label>
            </span>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} value='no'/>
              <label>None</label>
            </span>
          </div>
        </div>
      );
    }

    if (this.state.eventType === 'feeding' || this.state.eventType === 'meds') {
      medField = (
        <div className='pad-bottom-1em meds-field'>
          <h3>Did she take any medicine? <small>(Check all that apply)</small></h3>
          <div>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds} value='gas drops'/>
              <label>Gas Drops</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds} value='zantac'/>
              <label>Zantac</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds} value='eye drops'/>
              <label>Eye Drops</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds} value='tylenol'/>
              <label>Tylenol</label>
            </span>
          </div>
        </div>
      );
    }

    if (this.state.eventType === 'feeding' || this.state.eventType === 'diaper') {
      diaperField = (
        <div className='pad-bottom-1em diaper-field'>
          <h3>How was the diaper? <small>(Check all that apply)</small></h3>
          <div>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} defaultChecked  value='wet'/>
              <label>Wet</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} value='small poop'/>
              <label>Small Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} value='poop'/>
              <label>Normal Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} value='big poop'/>
              <label>Big Poop</label>
            </span>
          </div>
          <div className='pad-bottom-1em'>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} value='runny poop'/>
              <label>Runny Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper} value='dry poop'/>
              <label>Dry Poop</label>
            </span>
          </div>
        </div>
      );
    }

    if (this.state.eventType === 'feeding' || this.state.eventType === 'spit') {
      spitField = (
        <div className='pad-bottom-1em spit-field'>
          <h3>Any spit-up?</h3>
          <div>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit} value='big'/>
              <label>Big</label>
            </span>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit} value='small'/>
              <label>Small</label>
            </span>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit} defaultChecked value='no'/>
              <label>None</label>
            </span>
          </div>
        </div>
      );
    }

    return (
      <section className='modal-sheet'>
        <form id='feed-form' data-baby={baby} onSubmit={this._submit}>
          <h1>Log Event for {baby}</h1>

          <div className='pad-bottom-1em'>
            <h3>What type of event is this?</h3>
            <div>
              <span className='switch'>
                <input type='radio' name='eventType' onChange={this._setEventType} defaultChecked value='feeding'/>
                <label>Feeding</label>
              </span>
              <span className='switch'>
                <input type='radio' name='eventType' onChange={this._setEventType} value='meds' />
                <label>Meds</label>
              </span>
              <span className='switch'>
                <input type='radio' name='eventType' onChange={this._setEventType} value='diaper'/>
                <label>Diaper</label>
              </span>
              <span className='switch'>
                <input type='radio' name='eventType' onChange={this._setEventType} value='spit'/>
                <label>Spit-up</label>
              </span>
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>How long ago?</h3>
            <div>
              <span className='switch'>
                <input type='radio' name='time' onChange={this._setEventTime} value='0'/>
                <label>Just Now</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' onChange={this._setEventTime} value='15'/>
                <label>15 mins</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' onChange={this._setEventTime} defaultChecked value='30'/>
                <label>30 mins</label>
              </span>
            </div>
            <div>
              <span className='switch'>
                <input type='radio' name='time' onChange={this._setEventTime} value='45'/>
                <label>45 mins</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' onChange={this._setEventTime} value='60'/>
                <label>An hour</label>
              </span>
            </div>
          </div>

          {ounceField}

          {feederField}

          {burpField}

          {medField}

          {diaperField}

          {spitField}

          <input type='submit'
            className='btn btn-invert submit-btn'
            disabled={this.state.submitting ? 'disabled' : false}
            value={this.state.submitting ? 'Submitting...' : 'Submit'}/>
          <Link to="/" className='btn btn-cancel btn-invert' >Cancel</Link>
        </form>
      </section>
    );
  }
});

module.exports = Log;
