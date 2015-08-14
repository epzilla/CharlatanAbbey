/** @jsx React.DOM */
'use strict';

var React = require('react');
var moment = require('moment-timezone');
var _ = require('lodash');

var FeedingInfo = React.createClass({

  render: function () {
    var feeding = this.props.feeding;

    return (
      <article key={this.props.key} className="list-group-item">
        <h2>{ feeding.name } <span className="replace-poop" data-poop={ feeding.poopFlag }></span></h2>
        <em>Next feeding at ~
          { moment(new Date(feeding.time)).add(3, 'hours').format('h:mma') }
        </em>
        <p>Last Feeding</p>
        <ul>
          <li>
            Burp: { _.capitalize(feeding.burp) }
          </li>
          <li>
            Diaper: { _.capitalize(feeding.diaper) }
          </li>
          <li>
            Medicine: { _.capitalize(feeding.medicine) }
          </li>
          <li>
            Spit-up: { _.capitalize(feeding.spit) }
          </li>
        </ul>
      </article>
    );
  }
});

module.exports = FeedingInfo;
