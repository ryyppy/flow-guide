/* @flow */

import type { Unit, UnitValue } from './06-export';

// Flow does also recognize inheritantial relationships
class ConvertionError extends Error {
  to: Unit;
  unitValue: UnitValue;

  constructor(unitValue: UnitValue, to: Unit, message: string = 'Unexpected Convertion Error occurred') {
    super(message);
    this.unitValue = unitValue;
    this.to = to;
  }
}

const uv = { unit: 'm', value: 1000 };
const to = 'mi';
const convErr = new ConvertionError(uv, to, 'Cannot convert "Meter" to "Celsius"');

// Some example for typed error handling
Promise.reject(convErr)
  .catch((err: ConvertionError) => {
    console.log(`Failed to convert from '${err.unitValue.unit}' to '${err.to}'`);
  })
