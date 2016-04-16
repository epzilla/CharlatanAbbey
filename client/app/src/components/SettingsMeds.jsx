'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router';
import _ from 'lodash';
import EditableList from './EditableList.jsx';
import BabyStore from '../stores/baby-store';
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

  getInitialState: function () {
    return getMedsFromStore();
  },

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListener(this._onChange);
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

  _onChange: function () {
    this.setState(getMedsFromStore());
  },

  _onListEdit: function (e) {
    this.setState(e);
  },

  render: function () {
    return (
      <section className='specific-settings right-sheet'>
        <Swipeable
            onSwipedRight={this._onSwipedRight}
            delta={100}
          >
          <div className="form-container flex-center align-start">
            <form id='settings-meds' onSubmit={this._submit}>
              <Link to="/settings" className="close-btn breadcrumb flex-center">
                <i className="fa fa-chevron-left"></i>
              </Link>
              <div className='pad-bottom-1em'>
                <h3>Medicines</h3>
              </div>

              <EditableList
                className="caretaker-list"
                onChange={this._onListEdit}
                items={this.state.meds}
              />

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