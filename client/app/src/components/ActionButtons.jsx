/** @jsx React.DOM */
'use strict';

var React = require('react');
var Link = require('react-router').Link;
var ActionSheet = require('./ActionSheet.jsx');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Actions = require('../actions/view-actions');

var ActionButtons = React.createClass({

  getInitialState: function () {
    return {
      logEvent: false
    };
  },

  _dismissActionSheet: function () {
    this.setState({
      logEvent: false
    });
    document.querySelector('.action-btns').classList.add('background');
    window.setTimeout(function () {
      document.querySelector('.action-btns').classList.remove('background');
    }, 100);
  },

  _logEvent: function () {
    this.setState({
      logEvent: true
    });
    Actions.getFeeders();
  },

  render: function () {

    var actionSheet;

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
        <CSSTransitionGroup transitionName="action-sheet" >
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

module.exports = ActionButtons;