/** @jsx React.DOM */
'use strict';

var React = require('react');

var Feeder = React.createClass({

  render: function () {
    var plusMinusBtn = this.props.removable ?
      <button className="minus-button">-</button> :
      <button className="plus-button">+</button>;

    return (
      <div>
        <input type="text" defaultValue={this.props.name} placeholder="Enter name" />
        {plusMinusBtn}
      </div>
    );
  }
});

module.exports = Feeder;
