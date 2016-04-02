'use strict';

import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Actions from '../actions/view-actions';
import FeedingInfo from './FeedingInfo.jsx';
import EventStore from '../stores/event-store';
import TimeLogStore from '../stores/time-log-store';
import ActionButtons from './ActionButtons.jsx';

const BabiesSummaryView = React.createClass({
  getInitialState: function () {
    return {
      babyIDs: _.map(this.props.babies, '_id'),
      feedings: EventStore.getLatestFeedings(),
      timeLogs: TimeLogStore.getTimeLogs()
    };
  },

  _onChange: function () {
    this.setState({
      feedings: EventStore.getLatestFeedings(),
    });
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
    Actions.getEvents(this.state.babyIDs);
    Actions.getTimeLogs(this.state.babyIDs);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function () {
    let feedingsInfo;
    let that = this;

    if (_.isEmpty(that.state.feedings)) {
      feedingsInfo = (
        <div className="no-feedings">
          <h1>¯\_(ツ)_/¯</h1>
          <h3>
            Looks like you haven’t logged any feedings yet. When you do, the most
            recent ones will show up here on the home screen. Whenever you’re ready,
            go ahead and start logging down here!
          </h3>
          <div className="big-downward-arrow"></div>
        </div>
      );
    } else {
      feedingsInfo = _.map(that.state.feedings, function (feeding) {
        return <FeedingInfo key={feeding._id} baby={_.find(that.props.babies, {_id: feeding.babyID})} feeding={feeding} />;
      });
    }

    return (
      <article className='home-screen'>
        <section className="settings-menu-icon" >
          <Link to="/settings" className="settings-btn flex-center">
            <i className="fa fa-cog"></i>
          </Link>
        </section>
        <section className="baby-info">
          { feedingsInfo }
        </section>
        <ActionButtons babies={this.props.babies}/>
      </article>
    );
  }
});

export default BabiesSummaryView;
