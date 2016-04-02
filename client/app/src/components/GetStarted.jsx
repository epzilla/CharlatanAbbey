'use strict';

import React from 'react';
import _ from 'lodash';
import BabyStore from '../stores/baby-store';
import Actions from '../actions/view-actions';
import FractionalStepper from './FractionalStepper.jsx';
import Wizard from './Wizard.jsx';
import EditableList from './EditableList.jsx';
import SwitchButton from './SwitchButton.jsx';
import BabyNameWithIcon from './BabyNameWithIcon.jsx';
import * as uuid from '../utils/uuid';
import * as fractions from '../utils/fractions';

const View1 = React.createClass({
  _setValue: function (e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.props.onChange(obj);
  },

  render: function () {

    return (
      <div className="get-started-1">
        <h3>First things first. What are their names and genders?</h3>
        <div className="form-group pad-bottom-1em">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            defaultValue={this.props.initialState ? this.props.initialState.query.lastname : ''}
            onChange={this._setValue}
          />
        </div>
        <div className="form-group">
          <label htmlFor="babyA">Baby A</label>
          <input
            autoFocus={true}
            type="text"
            ref="babyA"
            name="babyA"
            placeholder="First Name"
            defaultValue={this.props.initialState ? this.props.initialState.babyA : ''}
            onChange={this._setValue}
          />
        </div>
        <div className="gender-select form-group">
          <SwitchButton
            key='gender-select-1-B'
            type='radio'
            name='babyASex'
            onChange={this._setValue}
            value='Boy'
            className="boy"
            defaultChecked={this.props.initialState && this.props.initialState.babyASex && this.props.initialState.babyASex === 'Boy'}
          />
          <SwitchButton
            key='gender-select-1-G'
            type='radio'
            name='babyASex'
            onChange={this._setValue}
            value='Girl'
            className="girl"
            defaultChecked={this.props.initialState && this.props.initialState.babyASex && this.props.initialState.babyASex === 'Girl'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="babyB">Baby B</label>
          <input
            type="text"
            name="babyB"
            placeholder="First Name"
            defaultValue={this.props.initialState ? this.props.initialState.babyB : ''}
            onChange={this._setValue}
          />
        </div>
        <div className="gender-select form-group">
          <SwitchButton
            key='gender-select-2-B'
            type='radio'
            name='babyBSex'
            onChange={this._setValue}
            value='Boy'
            className="boy"
            defaultChecked={this.props.initialState && this.props.initialState.babyASex && this.props.initialState.babyBSex === 'Boy'}
          />
          <SwitchButton
            key='gender-select-2-G'
            type='radio'
            name='babyBSex'
            onChange={this._setValue}
            value='Girl'
            className="girl"
            defaultChecked={this.props.initialState && this.props.initialState.babyASex && this.props.initialState.babyBSex === 'Girl'}
          />
        </div>
      </div>
    );
  }
});

const View2 = React.createClass({
  _updateHours: function (val) {
    if (val.full) {
      this.props.onChange({
        fullHours: val.amount
      });
    } else {
      this.props.onChange({
        fracHours: val.amount
      });
    }
  },

  _updateOunces: function (val) {
    if (val.full) {
      this.props.onChange({
        fullOunces: val.amount
      });
    } else {
      this.props.onChange({
        fracOunces: val.amount
      });
    }
  },

  render: function () {
    let initialOunces, initialHours;
    let _state = this.props.initialState;
    if (_state.fullOunces) {
      let fracOunces = _.isObject(_state.fracOunces) ? _state.fracOunces.actualValue : _state.fracOunces;
      initialOunces = _state.fullOunces + fracOunces;
    }

    if (_state.fullOunces) {
      let fracHours = _.isObject(_state.fracHours) ? _state.fracHours.actualValue : _state.fracHours;
      initialHours = _state.fullHours + fracHours;
    }

    return (
      <div className="get-started-2">
        <h3>Next, tell us about how often {_state.babyA} and {_state.babyB} usually eat/take a bottle, and how much milk/formula per feeding.</h3>
        <div>
          <FractionalStepper
            onChange={this._updateOunces}
            label="Oz."
            initialValue={initialOunces ? initialOunces : 4}
          />
        </div>
        <div>
          <h4>About every</h4>
          <FractionalStepper
            onChange={this._updateHours}
            label="Hrs."
            initialValue={initialHours ? initialHours : 2}
          />
        </div>
      </div>
    );
  }
});

const View3 = React.createClass({
  _onChange: function (val) {
    this.props.onChange({ feeders: val })
  },

  render: function () {

    return (
      <div className="get-started-3">
        <h3>Next, give us the names of a few people who will be taking care of them and might want to use this app.</h3>
        <EditableList
          className="feeder-list"
          onChange={this._onChange}
          items={this.props.initialState.feeders ? this.props.initialState.feeders : this.props.initialFeeders}
        />
      </div>
    );
  }
});

const View4 = React.createClass({
  _onChange: function (val) {
    this.props.onChange({ meds: val })
  },

  render: function () {

    return (
      <div className="get-started-4">
        <h3>Are there any medications they take, that you might want to log?</h3>
        <EditableList
          className="meds-list"
          onChange={this._onChange}
          items={this.props.initialState.meds ? this.props.initialState.meds : this.props.initialMeds}
        />
      </div>
    );
  }
});

const View5 = React.createClass({
  _joinList: function (items) {
    let names = _.map(items, function (item, i) {
      return (i === items.length - 1 && i > 0) ? 'and ' + item.name : item.name;
    })
    if (names.length > 2) {
      return names.join(', ');
    } else {
      return names.join(' ');
    }
  },

  render: function () {
    let info = this.props.info;
    return (
      <div className="get-started-5">
        <h3>OK. Let’s review what we have. If it all looks good, click “Done” and we’ll get going!</h3>
        <ul>
          <li className="babies">
            <BabyNameWithIcon baby={info.babyA} sex={info.babyASex}/>
            <BabyNameWithIcon baby={info.babyB} sex={info.babyBSex}/>
          </li>
          <li className="food">Eat about {fractions.getFraction(info.fullOunces, info.fracOunces)} ounces, every {fractions.getFraction(info.fullHours, info.fracHours)} hours.</li>
          <li className="people">Caretakers: {this._joinList(info.feeders)}</li>
          <li className="meds">Meds: {this._joinList(info.meds)}</li>
        </ul>
      </div>
    );
  }
});

const GetStarted = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      feeders: [
        {
          id: uuid.getUUID(),
          name: 'Mommy',
        },
        {
          id: uuid.getUUID(),
          name: 'Daddy',
        }
      ],
      meds: [
        {
          id: uuid.getUUID(),
          name: 'Tylenol'
        },
        {
          id: uuid.getUUID(),
          name: 'Gas Drops'
        },
        {
          id: uuid.getUUID(),
          name: 'Diaper Rash Cream'
        }
      ],
      babyASex: 'Boy',
      babyBSex: 'Boy',
      query: this.props.location.query,
      editing: null
    }
  },

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (!_.isEmpty(BabyStore.getBabies())) {
      this.context.router.push('/');
    }
  },

  _setStateFromChildren: function (state) {
    this.setState(state, () => console.info(this.state));
  },

  _submit: function (e) {
    e.preventDefault();
    Actions.sendInitialConfig(this.state);
  },

  render: function () {
    return (
      <section className="get-started">
        <Wizard
          initialState={this.props.query}
          views={[
            <View1
              initialState={this.state}
              onChange={this._setStateFromChildren}
              back={this.context.router.goBack}
              enableBackBtn
            />,
            <View2 initialState={this.state} onChange={this._setStateFromChildren}/>,
            <View3
              initialState={this.state}
              initialFeeders={this.state.feeders}
              onChange={this._setStateFromChildren}
            />,
            <View4
              initialState={this.state}
              initialMeds={this.state.meds}
              onChange={this._setStateFromChildren}
            />,
            <View5 info={this.state} onFinish={this._submit}/>
          ]}
        />
      </section>
    );
  }
});

export default GetStarted;
