import React from 'react';

const BabyNameWithIcon = React.createClass({

  render: function () {
    let classes = `baby-icon ${this.props.sex.toLowerCase()}`;
    return (
      <div className={classes}>
        <div>
          <i className="fa fa-child"></i>
        </div>
        <h3>{this.props.baby}</h3>
      </div>
    );
  }
});

export default BabyNameWithIcon;