'use strict';

import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import cx from 'classnames';

const FeedingInfo = React.createClass({

  _getFormattedFood: function () {
    let foodList;
    let food = this.props.feeding.food;
    let amt = this.props.feeding.amount;
    let bottleEmoji = <span className='emojifier'><img src='/img/bottle.png' className='emoji' /></span>;

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
    let medsEmoji, medsLi, spitLi, feederLi;
    let feeding = this.props.feeding;
    let poopEmojiClass = cx({
      'emojifier': true,
      'ok': feeding.poopFlag === 0,
      'warn': feeding.poopFlag === 1,
      'uh-oh': feeding.poopFlag === 2
    });

    let poopEmoji = (
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

export default FeedingInfo;
