/** @jsx React.DOM */
'use strict';

var React = require('react');
var moment = require('moment-timezone');
var _ = require('lodash');
var cx = require('classnames');

var FeedingInfo = React.createClass({

  render: function () {
    var feeding = this.props.feeding;
    var poopEmojiClass = cx({
      'emojifier': true,
      'ok': feeding.poopFlag === 0,
      'warn': feeding.poopFlag === 1,
      'uh-oh': feeding.poopFlag === 2
    });

    var poopEmoji = (
      <span className={poopEmojiClass} style={{display: 'inline'}}>
        <img align="absmiddle" alt=":poop:" className="emoji" src="/img/poop.png" title=":poop:" />
      </span>
    );

    return (
      <article key={this.props.key} className="list-group-item">
        <h2>{ feeding.name } {poopEmoji}</h2>
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
