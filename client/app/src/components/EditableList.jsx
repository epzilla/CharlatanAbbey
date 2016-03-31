'use strict';

import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import EditableItem from './EditableItem.jsx';
import * as uuid from '../utils/uuid';

const itemList = React.createClass({

  getInitialState: function () {
    return {
      editing: null,
      items: this.props.items || [],
      newitem: ''
    };
  },

  _add: function (e) {
    e.preventDefault();
    let id = uuid.getUUID();
    this.setState({
      items: this.state.items.concat({
        id: id,
        name: ''
      })
    }, function () {
      this.setState({
        editing: id
      })
    });
  },

  _destroy: function (item, e) {
    e.preventDefault();
    this.setState({
      items: _.reject(this.state.items, {id: item.id})
    }, function () {
      this.props.onChange(this.state.items);
    });
  },

  _edit: function (item) {
    this.setState({editing: item.id});
  },

  _save: function (itemToSave, text) {
    // this.props.model.save(itemToSave, text);
    //TODO save
    this.setState({
      editing: null,
      items: _.map(this.state.items, function (item) {
        return item !== itemToSave ? item : {id: item.id, name: text};
      })
    }, function () {
      this.props.onChange(this.state.items);
    });
  },

  _cancel: function () {
    this.setState({editing: null});
  },

  render: function () {
    let that = this;
    let items = _.map(this.state.items, function (item) {
      return (
        <EditableItem
          item={item}
          onDestroy={that._destroy.bind(that, item)}
          onEdit={that._edit.bind(that, item)}
          editing={that.state.editing === item.id}
          onSave={that._save.bind(that, item)}
          onCancel={that._cancel}
          key={item.id}
        />
      );
    });

    let classObj = { 'editable-list': true };
    if (this.props.className) {
      classObj[this.props.className] = true;
    }

    let classes = cx(classObj);

    return(
      <div className="editable-list-container">
        <ul className={classes}>
          {items}
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

export default itemList;

