'use strict';

import React from 'react';
import { Link } from 'react-router';
import ActionSheet from './ActionSheet.jsx';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Actions from '../actions/view-actions';

const ActionButtons = React.createClass({

  getInitialState: function () {
    return {
      logEvent: false
    };
  },

  _dismissActionSheet: function () {
    this.setState({
      logEvent: false
    });
  },

  _logEvent: function () {
    this.setState({
      logEvent: true
    });
    Actions.getFoodTypes();
  },

  render: function () {

    let actionSheet;

    if (this.state.logEvent) {
      actionSheet = (
        <ActionSheet
          key={this.state.logEvent}
          babies={this.props.babies}
          dismiss={this._dismissActionSheet}/>
      );
    }

    return (
      <div>
        <CSSTransitionGroup
          transitionName="action-sheet"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}>
          {actionSheet}
        </CSSTransitionGroup>
        <section className="action-btns flex-center" id="action-btns">
          <button className="btn action-btn" id="log-btn" onClick={this._logEvent}>
            <i className="fa fa-pencil"></i>Log Event
          </button>
          <Link to="/history" className="btn action-btn" id="history-btn">
            <i className="fa fa-history"></i>View History
          </Link>
        </section>
      </div>
    );
  }
});

export default ActionButtons;