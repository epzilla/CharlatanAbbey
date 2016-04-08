'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import _ from 'lodash';
import { Link } from 'react-router';
import BabyStore from '../stores/baby-store';
import FractionalStepper from './FractionalStepper.jsx';

const SettingsFeeding = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    let defaults = BabyStore.getDefaults();
    return {
      fullHours: 0,
      fracHours: 0,
      fullOunces: 0,
      fracOunces: 0
    };
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

  _updateHours: function (val) {
    if (val.full) {
      this.setState({
        fullHours: val.amount
      });
    } else {
      this.setState({
        fracHours: val.amount
      });
    }
  },

  _updateOunces: function (val) {
    if (val.full) {
      this.setState({
        fullOunces: val.amount
      });
    } else {
      this.setState({
        fracOunces: val.amount
      });
    }
  },

  render: function () {
    let initialOunces, initialHours;
    if (this.state.fullOunces) {
      let fracOunces = _.isObject(this.state.fracOunces) ? this.state.fracOunces.actualValue : this.state.fracOunces;
      initialOunces = this.state.fullOunces + fracOunces;
    }

    if (this.state.fullOunces) {
      let fracHours = _.isObject(this.state.fracHours) ? this.state.fracHours.actualValue : this.state.fracHours;
      initialHours = this.state.fullHours + fracHours;
    }

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
            <form id='settings-feeding' onSubmit={this._submit}>
              <div className='pad-bottom-1em'>
                <h3>Feeding Schedule</h3>
              </div>

              <div className="get-started-2">
                <h3>The usual amount is</h3>
                <div>
                  <FractionalStepper
                    onChange={this._updateOunces}
                    label="Oz."
                    initialValue={initialOunces ? initialOunces : 4}
                  />
                </div>
                <div>
                  <h4>About every</h4>
                  <FractionalStepper
                    onChange={this._updateHours}
                    label="Hrs."
                    initialValue={initialHours ? initialHours : 2}
                  />
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

export default SettingsFeeding;