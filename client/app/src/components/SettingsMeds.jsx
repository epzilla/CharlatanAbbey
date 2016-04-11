'use strict';

import React from 'react';
import _ from 'lodash';
import Swipeable from 'react-swipeable';
import Toggle from 'react-toggle';
import { Link } from 'react-router';
import BabyStore from '../stores/baby-store';
import MedScheduler from './MedScheduler.jsx';
import * as uuid from '../utils/uuid';

const getMedsFromStore = () => {
  let meds = _.map(BabyStore.getMeds(), (med) => {
    return {
      id: uuid.getUUID(),
      name: med.name
    };
  });
  return {meds: meds};
};

const SettingsMeds = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: () => {
    return getMedsFromStore();
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

  render: function () {
    let meds = _.map(this.state.meds, med => {
      return <MedScheduler key={med.uuid} med={med} onChange={this._updateMedSchedule} />;
    });

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
            <form id='settings-meds' onSubmit={this._submit}>
              <div className='pad-bottom-1em'>
                <h3>Medicine Schedule</h3>
              </div>

              <div className='form-group'>
                <label htmlFor='enable'>Enable Medicine Reminders</label>
                <Toggle id='enable' defaultChecked={true} onChange={this._onChange}/>
              </div>

              { meds }

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

export default SettingsMeds;