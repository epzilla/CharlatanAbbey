/** @jsx React.DOM */
'use strict';

var React = require('react');
var Navigation = require('react-router').Navigation;
var _ = require('lodash');
var Swipeable = require('react-swipeable');

var EventBtn = React.createClass({
  mixins: [ Navigation ],

  _logEvent: function () {
    this.transitionTo('log-event', {name: this.props.baby.name});
  },

  render: function () {
    var baby = this.props.baby;
    return (
      <button
        key={'button' + baby.birth}
        className="btn feed-btn"
        onClick={this._logEvent}>
        Feed {baby.name}
      </button>
    );
  }
});

var ActionSheet = React.createClass({

  _logEvent: function () {
    // body...
  },

  render: function () {
    var babies = _.map(this.props.babies, function (baby) {
      return <EventBtn key={'EventBtn' + baby.name} baby={baby}/>;
    });

    return (
      <Swipeable key={'Swipeable' + this.props.babies[0].weight} onSwipedDown={this.props.dismiss}>
        <section key={'section' + this.props.babies[0].name} className="action-sheet flex-center flex-col" id="action-sheet">
          <div key={'div-babies'} className='baby-btn-container flex-center flex-row'>
            {babies}
          </div>
          <div key={'div-cancel'} className='cancel-btn-container flex-center flex-row'>
            <button key={'cancel' + this.props.babies[0].name}
              className="btn feed-btn cancel-btn"
              onClick={this.props.dismiss}>
              Cancel
            </button>
          </div>
        </section>
      </Swipeable>
    );
  }
});

module.exports = ActionSheet;