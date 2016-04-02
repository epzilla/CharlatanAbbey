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
          </section>
        </Swipeable>
      </article>
    );
  }
});

export default Settings;