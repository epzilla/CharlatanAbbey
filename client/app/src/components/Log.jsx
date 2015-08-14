/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var State = Router.State;
var FeederStore = require('../stores/feeder-store');
var _ = require('lodash');
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
  _stepDown: function (e) {
    e.preventDefault();
    console.log('stepping down');
  },

  _stepUp: function (e) {
    e.preventDefault();
    console.log('stepping up');
  },

  render: function () {
    var full = this.props.full;
    var classes = cx({
      'stepper': true,
      'stepper-full': full,
      'stepper-fractional': !full
    });

    var startVal = full ? 2 : '--';

    return (
      <div className={classes}>
        <StepperBtn btnPos='top' onClick={this._stepUp}/>
        <span>{startVal}</span>
        <StepperBtn btnPos='bottom' onClick={this._stepDown}/>
      </div>
    );
  }
});

var OunceStepper = React.createClass({

  render: function () {
    return (
      <section className='ounce-stepper'>
        <Stepper full />
        <Stepper />
        <div className='ounce-label'>
          <label>Oz.</label>
        </div>
      </section>
    );
  }

});

var Log = React.createClass({

  mixins: [ State ],

  getInitialState: function () {
    return {
      feeders: FeederStore.getFeeders()
    };
  },

  render: function () {
    var baby = this.getParams().name;

    var feeders = _.map(this.state.feeders, function (f) {
      return (
        <span className='switch' key={f.name}>
          <input type='radio' name='feeder' value={f.name}/>
          <label>{f.name}</label>
        </span>
      );
    });

    return (
      <section className="modal-sheet">
        <form id='feed-form' data-baby={baby}>
          <h1>Time to feed {baby}!</h1>

          <div className='pad-bottom-1em'>
            <h3>How long ago did the feeding start?</h3>
            <div>
              <span className='switch'>
                <input type='radio' name='time' value='0'/>
                <label>Just Now</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' value='15'/>
                <label>15 mins</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' defaultChecked value='30'/>
                <label>30 mins</label>
              </span>
            </div>
            <div>
              <span className='switch'>
                <input type='radio' name='time' value='45'/>
                <label>45 mins</label>
              </span>
              <span className='switch'>
                <input type='radio' name='time' value='60'/>
                <label>An hour</label>
              </span>
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>How much did she eat?</h3>
            <OunceStepper />
          </div>

          <div className='pad-bottom-1em'>
            <h3>Who fed her?</h3>
            <div>
              {feeders}
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>Any burp?</h3>
            <div>
              <span className='switch'>
                <input type='radio' name='burp' defaultChecked value='big'/>
                <label>Big</label>
              </span>
              <span className='switch'>
                <input type='radio' name='burp' value='small' />
                <label>Small</label>
              </span>
              <span className='switch'>
                <input type='radio' name='burp' value='no'/>
                <label>None</label>
              </span>
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>Did she take any medicine?</h3>
            <div>
              <span className='switch'>
                <input type='checkbox' name='medicine' defaultChecked value='gas drops'/>
                <label>Gas Drops</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='medicine' value='zantac'/>
                <label>Zantac</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='medicine' value='eye drops'/>
                <label>Eye Drops</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='medicine' value='tylenol'/>
                <label>Tylenol</label>
              </span>
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>How was the diaper?</h3>
            <div>
              <span className='switch'>
                <input type='checkbox' name='diaper' defaultChecked  value='wet'/>
                <label>Wet</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='diaper' value='small poop'/>
                <label>Small Poop</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='diaper' value='poop'/>
                <label>Normal Poop</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='diaper' value='big poop'/>
                <label>Big Poop</label>
              </span>
            </div>
            <div className='pad-bottom-1em'>
              <span className='switch'>
                <input type='checkbox' name='diaper' value='runny poop'/>
                <label>Runny Poop</label>
              </span>
              <span className='switch'>
                <input type='checkbox' name='diaper' value='dry poop'/>
                <label>Dry Poop</label>
              </span>
            </div>
          </div>

          <div className='pad-bottom-1em'>
            <h3>Any spit-up?</h3>
            <div>
              <span className='switch'>
                <input type='radio' name='spit' value='big'/>
                <label>Big</label>
              </span>
              <span className='switch'>
                <input type='radio' name='spit' value='small'/>
                <label>Small</label>
              </span>
              <span className='switch'>
                <input type='radio' name='spit' defaultChecked value='no'/>
                <label>None</label>
              </span>
            </div>
          </div>

          <input type='submit' className='btn btn-invert submit-btn' />
          <Link to="/" className='btn btn-cancel btn-invert' >Cancel</Link>
        </form>
      </section>
    );
  }
});

module.exports = Log;
