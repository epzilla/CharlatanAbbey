var _ = require('lodash');

module.exports = {
  fractions: [
    {
      displayValue: '--',
      actualValue: 0.00
    },
    {
      displayValue: '¼',
      actualValue: 0.25
    },
    {
      displayValue: '⅓',
      actualValue: 0.33
    },
    {
      displayValue: '½',
      actualValue: 0.50
    },
    {
      displayValue: '⅔',
      actualValue: 0.67
    },
    {
      displayValue: '¾',
      actualValue: 0.75
    }
  ],

  getFraction: function (whole, frac) {
    if (!frac) {
      return whole.toString();
    }

    var fracDecimal = _.isObject(frac) ? frac.actualValue : frac.toPrecision(3);

    if (!fracDecimal) {
      return whole.toString();
    }

    var fracDisplay = _.find(this.fractions, {actualValue: fracDecimal}).displayValue;
    return whole + fracDisplay;
  },

  getDecimal: function (whole, frac) {
    var fracValue = _.isObject(frac) ? frac.actualValue : frac;
    return !fracValue ? whole : (whole + fracValue);
  },

  getByActualValue: function (actualValue) {
    return _.find(this.fractions, {actualValue: actualValue});
  },

  getByDisplayValue: function (displayValue) {
    return _.find(this.fractions, {displayValue: displayValue});
  }
};