/* @flow */

import type { Unit, UnitValue } from './06-export';

// Flow does also recognize inheritantial relationships
class ConversionError extends Error {
  to: Unit;
  unitValue: UnitValue;

  constructor(unitValue: UnitValue, to: Unit, message: string = 'Unexpected Conversion Error occurred') {
    super(message);
    this.unitValue = unitValue;
    this.to = to;
  }
}

const uv = { unit: 'm', value: 1000 };
const to = 'mi';
const convErr = new ConversionError(uv, to, 'Cannot convert "Meter" to "Celsius"');

// Some example for typed error handling
Promise.reject(convErr)
  .catch((err: ConversionError) => {
    console.log(`Failed to convert from '${err.unitValue.unit}' to '${err.to}'`);
  })
