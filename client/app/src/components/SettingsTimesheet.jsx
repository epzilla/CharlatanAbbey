'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router';

const SettingsTimesheet = React.createClass({
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

  render: function () {
    return (
      <section className='right-sheet'>
        <Swipeable
            onSwipedRight={this._onSwipedRight}
            delta={100}
          >
          <form id='settings-timesheet' onSubmit={this._submit}>
            <div className='pad-bottom-1em'>
              <h3>Caretaker Timesheet Settings</h3>
            </div>

            <div className='form-group'>
              <label htmlFor='enable'>Enable Time Tracking</label>
              <input type='checkbox' name='enable'/>
            </div>

            <div className='form-group'>
              <label htmlFor='rate'>Hourly Rate (USD)</label>
              <input type='number' className='rate' name='rate'/>
            </div>

            <input type='submit'
              className='btn btn-invert submit-btn'
              disabled={this.state.submitting ? 'disabled' : false}
              value={this.state.submitting ? 'Submitting...' : 'Submit'}
            />
          </form>
        </Swipeable>
      </section>
    );
  }
});

export default SettingsTimesheet;