import React from 'react';
import _ from 'lodash';

const SwitchButton = React.createClass({

  render: function () {
    let emoji;

    if (this.props.emoji) {
      let label = this.props.label ? this.props.label : _.capitalize(this.props.value);
      emoji = (
        <span className='emojifier' style={{display: 'inline'}}>
          <img
            className='emoji'
            src={this.props.emoji}
            title={label}
            alt={label}
          />
        </span>
      );
    }

    return (
      <span className='switch'>
        <input
          type={this.props.type}
          name={this.props.name}
          onChange={this.props.onChange}
          defaultChecked={this.props.defaultChecked}
          value={this.props.value}
        />
        <label>
          {this.props.label ? _.capitalize(this.props.label) : _.capitalize(this.props.value)}{emoji}
        </label>
      </span>
    );
  }
});

export default SwitchButton;