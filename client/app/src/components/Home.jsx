/** @jsx React.DOM */
'use strict';

var React = require('react');
var FeedingInfo = require('./FeedingInfo.jsx');
var FeedingStore = require('../stores/feeding-store');
var BabyStore = require('../stores/baby-store');
var ActionButtons = require('./ActionButtons.jsx');

var APP = React.createClass({
  getInitialState: function(){
    return {
      feedings: FeedingStore.getLatestFeedings(),
      babies: BabyStore.getBabies()
    };
  },

  _onChange: function(){
    this.setState({
      feedings: FeedingStore.getLatestFeedings(),
      babies: BabyStore.getBabies()
    });
  },

  componentDidMount: function(){
    FeedingStore.addChangeListener(this._onChange);
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    FeedingStore.removeChangeListener(this._onChange);
    BabyStore.removeChangeListener(this._onChange);
  },

  render: function(){
    var feedings = [];
    this.state.feedings.forEach(function (feeding) {
      feedings.push( <FeedingInfo key={feeding._id} feeding={feeding} /> );
    });

    return (
      <article className='home-screen'>
        <section className="baby-info">
          { feedings }
        </section>
        <ActionButtons babies={this.state.babies}/>
      </article>
    );
  }
});

module.exports = APP;
