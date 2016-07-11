/* @flow */

import assert from 'assert';
import { convertUnit } from './08-maybe-and-optionals';
import { CONVERSION_TABLE } from './06-export';
import type { Unit, UnitValue } from './06-export';

// Of course, flow does also support classes, so let us
// write a class to get a feeling for class syntax
class Converter {
  // Type-definition of this-values
  from: Unit;
  to: Unit;

  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  convert(value: number): ?number {
    return convertUnit(this.from, this.to, value);
  }
}

const c = new Converter('m', 'km');

const value = c.convert(1500);

assert.equal(value, 1.5);
