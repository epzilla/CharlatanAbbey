'use strict';

var React = require('react');
var BabyStore = require('../stores/baby-store');
var Actions = require('../actions/view-actions');

var LoginForm = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    BabyStore.removeChangeListener(this._onChange);
  },

  _lookUpBabies: function (e) {
    e.preventDefault();
    Actions.findBabies(this.state);
  },

  _setValue: function (e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  },

  _onChange: function () {
    if (BabyStore.getSearchFailed()) {
      this.context.router.push({ pathname: 'get-started', query: this.state});
    } else {
      this.setState({
        babies: BabyStore.getBabies(),
        failedSearch: BabyStore.getSearchFailed()
      });
    }
  },

  render: function () {
    return (
      <div className="login-form-container">
        <form onSubmit={this._lookUpBabies} className="login-form">
          <h2>Hi there!</h2>
          <p>
            Let’s get started. Please enter the last name and birthdate of
            the babies you’d like to start tracking. If someone has already
            entered them into the system, you can start tracking them right
            away. If not, we’ll just ask you a few more questions to get things
            set up.
          </p>
          <div className="form-group">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" name="lastname" placeholder="Last Name" onChange={this._setValue} />
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Birthdate</label>
            <input type="date" name="birthdate" onChange={this._setValue} />
          </div>
          <div className="form-group submit-btn-container">
            <button className="btn submit-btn">Submit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = LoginForm;
