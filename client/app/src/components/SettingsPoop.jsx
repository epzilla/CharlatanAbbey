'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import Toggle from 'react-toggle';
import { Link } from 'react-router';
import Stepper from './Stepper.jsx';

const SettingsPoop = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: () => {
    return {submitting: false}
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

_updateWatchHours: function (val) {
    this.setState({
      watchHours: val.amount
    });
  },

  _updateWarningHours: function (val) {
    this.setState({
      warningHours: val.amount
    });
  },

  render: function () {
    return (
      <section className='specific-settings right-sheet'>
        <Swipeable
            onSwipedRight={this._onSwipedRight}
            delta={100}
          >
          <Link to="/settings" className="close-btn breadcrumb flex-center">
            <i className="fa fa-chevron-left"></i>
          </Link>
          <div className="form-container flex-center align-start">
            <form id='settings-poop' onSubmit={this._submit}>
              <div className='pad-bottom-1em'>
                <h3>Poop Schedule</h3>
              </div>

              <div className='form-group'>
                <label htmlFor='enable'>Enable Poop Warnings</label>
                <Toggle id='enable' defaultChecked={true} onChange={this._onChange}/>
              </div>

              <div className="get-started-2">
                <h3>After how long would you start to be concerned if your baby hadn’t pooped?</h3>
                <div className='stepper-with-label'>
                  <Stepper
                    full
                    onChange={this._updateWarningHours}
                    label="Hrs."
                    initialValue={this.state.watchHours ? this.state.watchHours : 24}
                  />
                  <span className="step-label">Hours</span>
                </div>
                <h3>After how long would you call the doctor?</h3>
                <div className='stepper-with-label'>
                  <Stepper
                    full
                    onChange={this._updateWarningHours}
                    label="Hrs."
                    initialValue={this.state.warningHours ? this.state.warningHours : 72}
                  />
                  <span className="step-label">Hours</span>
                </div>
              </div>

              <input type='submit'
                className='btn btn-invert submit-btn'
                disabled={this.state.submitting ? 'disabled' : false}
                value={this.state.submitting ? 'Saving...' : 'Save'}
              />
            </form>
          </div>
        </Swipeable>
      </section>
    );
  }
});

export default SettingsPoop;