/** @jsx React.DOM */
'use strict';

var React = require('react');
var moment = require('moment-timezone');
var _ = require('lodash');
var cx = require('classnames');

var FeedingInfo = React.createClass({

  _getFormattedAmount: function () {
    var amt = this.props.feeding.amount;
    if (amt % 1 === 0) {
      return Math.floor(amt);
    } else {
      return amt.toFixed(2);
    }
  },

  render: function () {
    var medsEmoji, medsLi, spitLi, feederLi;
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

    if (feeding.zantacFlag) {
      medsEmoji = (
        <span className="emojifier" style={{display: 'inline'}}>
          <img align="absmiddle" alt=":pill:" className="emoji" src="/img/pill.png" title=":pill:" />
        </span>
      );
    }

    if (feeding.medicine) {
      medsLi = (
        <li>
          Medicine: { _.capitalize(feeding.medicine) }
        </li>
      );
    }

    if (feeding.spit) {
      spitLi = (
        <li>
          { _.capitalize(feeding.spit) } spit-up
        </li>
      );
    }

    if (feeding.feeder) {
      feederLi = (
        <li>
          Fed by { _.capitalize(feeding.feeder) }
        </li>
      );
    }

    return (
      <article key={this.props.key} className="list-group-item">
        <h2>{ feeding.name } {poopEmoji} {medsEmoji}</h2>
        <em>Next feeding at ~
          { moment(new Date(feeding.time)).add(3, 'hours').format('h:mma') }
        </em>
        <p>Last Feeding</p>
        <ul>
          <li>
            {this._getFormattedAmount()} oz.
          </li>
          <li>
            { _.capitalize(feeding.burp) } burp
          </li>
          <li>
            { _.capitalize(feeding.diaper) } diaper
          </li>
          {medsLi}
          {spitLi}
          {feederLi}
        </ul>
      </article>
    );
  }
});

module.exports = FeedingInfo;
