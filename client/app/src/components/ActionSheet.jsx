'use strict';

import React from 'react';
import _ from 'lodash';
import Swipeable from 'react-swipeable';

const EventBtn = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _logEvent: function () {
    this.props.dismiss();
    this.context.router.push('/log-event/' + this.props.baby._id);
  },

  render: function () {
    let baby = this.props.baby;
    return (
      <button
        key={'button' + baby.birth}
        className="btn feed-btn"
        onClick={this._logEvent}>
        Log {baby.firstname}
      </button>
    );
  }
});

const ActionSheet = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _logTime: function () {
    this.props.dismiss();
    this.context.router.push('timesheet');
  },

  render: function () {
    let that = this;
    let babies = _.map(this.props.babies, function (baby) {
      return <EventBtn key={'EventBtn' + baby.firstname} baby={baby} dismiss={that.props.dismiss}/>;
    });

    return (
      <Swipeable className='swipeable-action-sheet' key={'Swipeable' + this.props.babies[0].weight} onSwipedDown={this.props.dismiss}>
        <section key={'section' + this.props.babies[0].name} className="action-sheet flex-center flex-col" id="action-sheet">
          <div key={'div-babies'} className='baby-btn-container flex-center flex-row'>
            {babies}
          </div>
          <div key={'div-timesheet-btn'} className='baby-btn-container flex-center flex-row'>
            <button key={'nanny' + this.props.babies[0].name}
              className="btn feed-btn timesheet-btn"
              onClick={this._logTime}>
              <i className="fa fa-clock-o"></i> Nanny Timesheet
            </button>
          </div>
          <div key={'div-cancel-btn'} className='baby-btn-container flex-center flex-row'>
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

export default ActionSheet;