'use strict';

import React from 'react';
import _ from 'lodash';
import Feeder from './Feeder.jsx';
import BabyStore from '../stores/baby-store';
import Actions from '../actions/view-actions';
import * as uuid from '../utils/uuid';

const ENTER_KEY = 13;

const FeederList = React.createClass({

  getInitialState: function () {
    return {
      editing: null,
      feeders: this.props.feeders || [],
      newFeeder: ''
    };
  },

  _add: function (e) {
    e.preventDefault();
    let id = uuid.getUUID();
    this.setState({
      feeders: this.state.feeders.concat({
        id: id,
        name: ''
      })
    }, function () {
      this.setState({
        editing: id
      })
    });
  },

  _destroy: function (feeder, e) {
    e.preventDefault();
    this.setState({
      feeders: _.reject(this.state.feeders, {id: feeder.id})
    }, function () {
      this.props.onChange(this.state.feeders);
    });
  },

  _edit: function (feeder) {
    this.setState({editing: feeder.id});
  },

  _save: function (feederToSave, text) {
    // this.props.model.save(feederToSave, text);
    //TODO save
    this.setState({
      editing: null,
      feeders: _.map(this.state.feeders, function (feeder) {
        return feeder !== feederToSave ? feeder : {id: feeder.id, name: text};
      })
    }, function () {
      this.props.onChange(this.state.feeders);
    });
  },

  _cancel: function () {
    this.setState({editing: null});
  },

  render: function () {
    let that = this;
    let feeders = _.map(this.state.feeders, function (feeder) {
      return (
        <Feeder
          feeder={feeder}
          onDestroy={that._destroy.bind(that, feeder)}
          onEdit={that._edit.bind(that, feeder)}
          editing={that.state.editing === feeder.id}
          onSave={that._save.bind(that, feeder)}
          onCancel={that._cancel}
          key={feeder.id}
        />
      );
    });

    return(
      <div className="feeder-list-container">
        <ul className="feeder-list">
          {feeders}
        </ul>
        <div className="btn-container">
          <button className="btn btn-add" onClick={this._add}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
    );
  }
});

export default FeederList;

