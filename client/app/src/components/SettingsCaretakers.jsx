'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router';
import _ from 'lodash';
import EditableList from './EditableList.jsx';
import FeederStore from '../stores/feeder-store';
import * as uuid from '../utils/uuid';

const getFeedersFromStore = () => {
  let feeders = _.map(FeederStore.getFeeders(), (feeder) => {
    return {
      id: uuid.getUUID(),
      name: feeder.name
    };
  });
  return {feeders: feeders};
};

const SettingsCaretakers = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return getFeedersFromStore();
  },

  componentDidMount: function () {
    FeederStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    FeederStore.removeChangeListener(this._onChange);
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

  _onChange: function () {
    this.setState(getFeedersFromStore());
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
            <form id='settings-caretakers' onSubmit={this._submit}>
              <Link to="/settings" className="close-btn breadcrumb flex-center">
                <i className="fa fa-chevron-left"></i>
              </Link>
              <div className='pad-bottom-1em'>
                <h3>Caretakers</h3>
              </div>

              <EditableList
                className="caretaker-list"
                onChange={this._onListEdit}
                items={this.state.feeders}
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

export default SettingsCaretakers;