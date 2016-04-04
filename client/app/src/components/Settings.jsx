import React from 'react';
import Swipeable from 'react-swipeable';
import { Link } from 'react-router';

const Settings = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _onSwipedRight: function (e) {
    e.preventDefault();
    this.context.router.push('/');
  },

  render: function () {
    return (
      <article className="right-sheet">
        <Swipeable
          onSwipedRight={this._onSwipedRight}
          delta={100}
        >
          <section className="settings">
            <h2>Settings</h2>
            <Link to="/" className="close-btn flex-center">
              <i className="fa fa-close"></i>
            </Link>
            <ul className="settings-list">
              <Link to="/settings/names">
                <li className="category">
                  <i className="fa fa-child"></i> Names
                </li>
              </Link>
              <Link to="/settings/caretakers">
                <li className="category">
                  <i className="fa fa-users"></i> Caretakers
                </li>
              </Link>
              <Link to="/settings/feedings">
                <li className="category">
                  <span className='emojifier'><img src='/img/bottle.png' className='emoji' /></span> Feeding Schedule
                </li>
              </Link>
              <Link to="/settings/meds">
                <li className="category">
                    <span className='emojifier'><img src='/img/pill.png' className='emoji' /></span> Medicine Schedule
                </li>
              </Link>
              <Link to="/settings/poop">
                <li className="category">
                  <span className='emojifier'><img src='/img/poop.png' className='emoji' /></span> Poop Schedule
                </li>
              </Link>
              <Link to="/settings/solids">
                <li className="category">
                  <span className='emojifier'><img src='/img/bananas.png' className='emoji' /></span> Solid Foods
                </li>
              </Link>
              <Link to="/settings/timesheet">
                <li className="category">
                  <i className="fa fa-list-alt"></i> Caretaker Timesheet
                </li>
              </Link>
            </ul>
          </section>
        </Swipeable>
      </article>
    );
  }
});

export default Settings;