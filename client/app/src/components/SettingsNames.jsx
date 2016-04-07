'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import _ from 'lodash';
import BabyStore from '../stores/baby-store';

const SettingsNames = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: () => { return { babies: BabyStore.getBabies() } },

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
    this.setState({ babies: BabyStore.getBabies() });
  },

  _setValue: function (e) {
    let obj = _.cloneDeep(this.state);
    let i = e.target.name === 'babyA' ? 0 : 1;
    obj.babies[i].firstname = e.target.value;
    this.setState(obj, () => console.log(this.state));
  },

  render: function () {
    return (
      <section className='specific-settings right-sheet'>
        <Swipeable
            onSwipedRight={this._onSwipedRight}
            delta={100}
          >
          <div className="form-container flex-center align-start">
            <form id='settings-babies' onSubmit={this._submit}>
              <div className='pad-bottom-1em'>
                <h3>Names</h3>
              </div>

              <div className="form-group">
                <label htmlFor="babyA">Baby A</label>
                <input
                  type="text"
                  defaultValue={this.state.babies[0].firstname}
                  name="babyA"
                  onChange={this._setValue}
                />
              </div>

              <div className="form-group">
                <label htmlFor="babyB">Baby B</label>
                <input
                  type="text"
                  defaultValue={this.state.babies[1].firstname}
                  name="babyB"
                  onChange={this._setValue}
                />
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

export default SettingsNames;