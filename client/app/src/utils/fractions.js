import _ from 'lodash';

export const fractions = [
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
];

export const getFraction = (whole, frac) => {
  if (!frac) {
    return whole.toString();
  }

  let fracDecimal = _.isObject(frac) ? frac.actualValue : parseFloat(frac.toPrecision(2));

  if (!fracDecimal) {
    return whole.toString();
  }

  let fracDisplay = _.find(fractions, {actualValue: fracDecimal}).displayValue;
  return whole + fracDisplay;
};

export const getDecimal = (whole, frac) => {
  let fracValue = _.isObject(frac) ? frac.actualValue : frac;
  return !fracValue ? whole : (whole + fracValue);
};

export const getByActualValue = actualValue => _.find(fractions, {actualValue: actualValue});

export const getByDisplayValue = displayValue => _.find(fractions, {displayValue: displayValue});