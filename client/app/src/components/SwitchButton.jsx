var React = require('react');
var _ = require('lodash');

var SwitchButton = React.createClass({

  render: function () {
    var emoji;

    if (this.props.emoji) {
      var label = this.props.label ? this.props.label : _.capitalize(this.props.value);
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

module.exports = SwitchButton;