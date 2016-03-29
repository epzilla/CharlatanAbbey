'use strict';

import React from 'react';
import _ from 'lodash';
import Actions from '../actions/view-actions';
import WizardStore from '../stores/wizard-store';

const Wizard = React.createClass({
  getInitialState: function () {
    let initialState = this.props.initialState || {};
    return _.assign(initialState, WizardStore.getAll());
  },

  componentDidMount: function () {
    WizardStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    WizardStore.removeChangeListener(this._onChange);
  },

  _currentStep: function () {
    return this.props.views[this.state.step];
  },

  _onChange: function () {
    this.setState(WizardStore.getAll());
  },

  _next: function (e) {
    e.preventDefault();
    Actions.wizardNext();
  },

  _prev: function (e) {
    e.preventDefault();
    if (this._currentStep().props.enableBackBtn) {
      this._currentStep().props.back();
    } else {
      Actions.wizardPrev();
    }
  },

  render: function () {
    let currentView = this.props.views[this.state.step];
    let nextBtn = currentView.props.onFinish ?
      <button className="btn" onClick={currentView.props.onFinish}>Done</button> :
      <button className="btn" onClick={this._next} disabled={this.state.step === this.props.views.length - 1}>Next</button>;

    return (
      <div className="wizard-container">
        <section className="wizard">
          <form onSubmit={this.props.onSubmit}>
            <div className="wizard-view">
              {this.props.views[this.state.step]}
            </div>
            <div className="wizard-btns">
              <button
                className="btn"
                onClick={this._prev}
                disabled={
                  this.state.step === 0 &&
                  !this._currentStep().props.enableBackBtn
                }
              >
                Back
              </button>
              {nextBtn}
            </div>
          </form>
        </section>
      </div>
    );
  }
});

export default Wizard;
