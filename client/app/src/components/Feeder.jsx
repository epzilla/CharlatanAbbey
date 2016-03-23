/** @jsx React.DOM */
'use strict';

var React = require('react');

var Feeder = React.createClass({
  render: function () {
    var plusMinusBtn = this.props.removable ?
      <button className="minus-button" value={this.props.name} onClick={this.props.remove}>-</button> :
      <button className="plus-button" value={this.props.name} onClick={this.props.add}>+</button>;

    return (
      <div>
        <input type="text" defaultValue={this.props.name} data-index={this.props.index} onChange={this.props.onChange} placeholder="Enter name" />
        {plusMinusBtn}
      </div>
    );
  }
});

module.exports = Feeder;
