/** @jsx React.DOM */
'use strict';

var React = require('react');
var moment = require('moment-timezone');
var _ = require('lodash');
var cx = require('classnames');

var FeedingInfo = React.createClass({

  _getFormattedFood: function () {
    var foodList;
    var food = this.props.feeding.food;
    var amt = this.props.feeding.amount;
    var bottleEmoji = <span className='emojifier'><img src='/img/bottle.png' className='emoji' /></span>;

    if (amt % 1 === 0) {
      amt = Math.floor(amt) + ' oz.';
    } else {
      amt = amt.toFixed(2) + ' oz.';
    }

    if (food) {
      foodList = ' + ' + food;
    }

    return (
      <li>
        {amt}{bottleEmoji}{foodList}
      </li>
    );
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

    if (feeding.prevacidFlag) {
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
          {this._getFormattedFood()}
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
