'use strict';

import React from 'react';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router';
import _ from 'lodash';
import EditableList from './EditableList.jsx';
import FoodTypeStore from '../stores/food-type-store';

const getFoodTypesFromStore = () => {
  let foodTypes = _.map(FoodTypeStore.getFoodTypes(), (ft) => {
    return {
      id: uuid.getUUID(),
      name: ft.name
    };
  });
  return {foodTypes: foodTypes};
};

const SettingsSolidFoods = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: () => {
    return getFoodTypesFromStore();
  },

  componentDidMount: function () {
    FoodTypeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    FoodTypeStore.removeChangeListener(this._onChange);
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/settings');
  },

  _onChange: function () {
    this.setState(getFoodTypesFromStore());
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
          <div className="form-container flex-center">
            <form id='settings-solid-foods' onSubmit={this._submit}>
              <div className='pad-bottom-1em'>
                <h3>Solid Foods</h3>
              </div>

              <EditableList
                className="food-type-list"
                onChange={this._onListEdit}
                items={this.state.foodTypes}
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

export default SettingsSolidFoods;