'use strict';

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import EventStore from '../stores/event-store';
import BabyStore from '../stores/baby-store';
import Actions from '../actions/view-actions';
import TimeStepper from './TimeStepper.jsx';
import FractionalStepper from './FractionalStepper.jsx';

const Edit = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _submit: function (e) {
    e.preventDefault();
    let amount = (this.state.fullAmount || 2) + (this.state.fracAmount || 0);

    Actions.editEventForm({
      _id: this.props.params.logEvent,
      name: this.state.baby,
      eventType: this.state.eventType,
      burp: this.state.burp,
      diaper: this.state.diaper.join(' + '),
      feeder: this.state.feeder,
      time: this.state.time.format(),
      amount: amount,
      medicine: this.state.medicine.join(', '),
      spit: this.state.spit
    });
  },

  _cancel: function (e) {
    e.preventDefault();
    this.context.router.goBack();
  },

  _setEventType: function (e) {
    this.setState({
      eventType: e.target.value
    });
  },

  _setEventTime: function (e) {
    this.setState({
      time: e
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
    let meds = this.state.medicine;
    let val = e.target.value;

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
    let diapers = this.state.diaper;
    let val = e.target.value;

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
    this.context.router.push('history');
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    let e = EventStore.getEvent(this.props.params.logEvent);
    let diaper = e.diaper;
    let meds = e.medicine;

    if (diaper) {
      diaper = diaper.split(' + ');
    }

    if (meds) {
      meds = meds.split(', ');
    }

    return {
      logEvent: e,
      amount: e.amount,
      eventType: e.eventType,
      name: e.name,
      diaper: diaper || [],
      feeder: e.feeder,
      feeders: BabyStore.getFeeders(),
      medicine: meds || [],
      burp: e.burp,
      spit: e.spit,
      time: moment(e.time)
    };
  },

  render: function () {
    let that = this;
    let logEvent = this.state.logEvent;
    let baby = logEvent.name;
    let time = moment(logEvent.time);

    let ounceField, feederField, medField, burpField, diaperField, spitField;

    if (logEvent.eventType === 'feeding') {
      ounceField = (
        <div className='pad-bottom-1em ounce-field'>
          <h3>How much did she eat?</h3>
          <FractionalStepper
            onChange={this._setAmount}
            initialValue={logEvent.amount}
            label="Oz."
          />
        </div>
      );

      let feeders = _.map(this.state.feeders, function (f) {
        return (
          <span className='switch' key={f.name}>
            <input type='radio'
                   name='feeder'
                   onChange={that._setFeeder}
                   value={f.name}
                   defaultChecked={logEvent.feeder === f.name}/>
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

    if (logEvent.eventType === 'feeding' || logEvent.eventType === 'burp') {
      burpField = (
        <div className='pad-bottom-1em burp-field'>
          <h3>Any burp?</h3>
          <div>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} defaultChecked={logEvent.burp === 'big'} value='big'/>
              <label>Big</label>
            </span>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} defaultChecked={logEvent.burp === 'small'} value='small' />
              <label>Small</label>
            </span>
            <span className='switch'>
              <input type='radio' name='burp' onChange={this._setBurp} defaultChecked={logEvent.burp === 'no'} value='no'/>
              <label>None</label>
            </span>
          </div>
        </div>
      );
    }

    if (logEvent.eventType === 'feeding' || logEvent.eventType === 'meds') {
      medField = (
        <div className='pad-bottom-1em meds-field'>
          <h3>Did she take any medicine?</h3>
          <div>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds}
                     defaultChecked={_.contains(logEvent.medicine, 'gas drops')} value='gas drops'/>
              <label>Gas Drops</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds}
                     defaultChecked={_.contains(logEvent.medicine, 'prevacid')} value='prevacid'/>
              <label>Prevacid</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds}
                     defaultChecked={_.contains(logEvent.medicine, 'eye drops')} value='eye drops'/>
              <label>Eye Drops</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='medicine' onChange={this._setMeds}
                     defaultChecked={_.contains(logEvent.medicine, 'tylenol')} value='tylenol'/>
              <label>Tylenol</label>
            </span>
          </div>
        </div>
      );
    }

    if (logEvent.eventType === 'feeding' || logEvent.eventType === 'diaper') {
      diaperField = (
        <div className='pad-bottom-1em diaper-field'>
          <h3>How was the diaper?</h3>
          <div>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, 'wet')} value='wet'/>
              <label>Wet</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, 'small')} value='small poop'/>
              <label>Small Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, '+ poop')} value='poop'/>
              <label>Normal Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, 'big')} value='big poop'/>
              <label>Big Poop</label>
            </span>
          </div>
          <div className='pad-bottom-1em'>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, 'runny')} value='runny poop'/>
              <label>Runny Poop</label>
            </span>
            <span className='switch'>
              <input type='checkbox' name='diaper' onChange={this._setDiaper}
                     defaultChecked={_.contains(logEvent.diaper, 'dry')} value='dry poop'/>
              <label>Dry Poop</label>
            </span>
          </div>
        </div>
      );
    }

    if (logEvent.eventType === 'feeding' || logEvent.eventType === 'spit') {
      spitField = (
        <div className='pad-bottom-1em spit-field'>
          <h3>Any spit-up?</h3>
          <div>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit}
                     defaultChecked={_.contains(logEvent.spit, 'big')} value='big'/>
              <label>Big</label>
            </span>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit}
                     defaultChecked={_.contains(logEvent.spit, 'small')} value='small'/>
              <label>Small</label>
            </span>
            <span className='switch'>
              <input type='radio' name='spit' onChange={this._setSpit}
                     defaultChecked={_.contains(logEvent.spit, 'no')} value='no'/>
              <label>None</label>
            </span>
          </div>
        </div>
      );
    }

    return (
      <section className='modal-sheet edit'>
        <form id='feed-form' data-baby={baby} onSubmit={this._submit}>
          <h1>Edit Event for {baby}</h1>

          <div className='pad-bottom-1em'>
            <h3>What type of event was this?</h3>
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
            <h3>What Time?</h3>
            <TimeStepper identifier='event-time-stepper' time={time} onChange={this._setEventTime}/>
          </div>

          {ounceField}

          {feederField}

          {burpField}

          {medField}

          {diaperField}

          {spitField}

          <input type='submit' className='btn btn-invert submit-btn' />
          <button onClick={this._cancel} className='btn btn-cancel btn-invert' >Cancel</button>
        </form>
      </section>
    );
  }
});

export default Edit;