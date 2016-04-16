import React from 'react';
import cx from 'classnames';
import { fractions } from '../utils/fractions';

const MedScheduler = React.createClass({

  _setMeds: (e) => {
    e.preventDefault();
    this.props.onChange(e);
  },

  render: function () {
    return (
      <div className="med-scheduler">
        <h4>{this.props.med.name}</h4>
        <div className="form-group">
          <label htmlFor="dosage">Dosage:</label>
          <input name="dosage" id="dosage" defaultValue={this.props.med.dosage || 0} type="number" /> mg.
        </div>
        <div className="form-group">
          <label htmlFor="recurrence">Every:</label>
          <input name="recurrence" id="recurrence" dosage={this.props.med.hours || 4} type="number" /> hrs.
        </div>
        <button className="btn submit-btn">Set</button>
      </div>
    );
  }
});

export default MedScheduler;