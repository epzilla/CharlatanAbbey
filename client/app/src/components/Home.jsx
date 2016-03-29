'use strict';

import React from 'react';
import _ from 'lodash';
import ls from '../utils/local-storage';
import BabyStore from '../stores/baby-store';
import LoginForm from './LoginForm.jsx';
import BabiesSummaryView from './BabiesSummaryView.jsx';

var Home = React.createClass({
  getInitialState: function () {
    return {
      babies: ls.get('babies')
    };
  },

  _onChange: function () {
    this.setState({
      babies: BabyStore.getBabies()
    });
  },

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListener(this._onChange);
  },

  render: function () {
    return _.isEmpty(this.state.babies) ? <LoginForm /> : <BabiesSummaryView babies={this.state.babies} />;
  }
});

module.exports = Home;
