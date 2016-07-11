/* @flow */

import assert from 'assert';
import { CONVERSION_TABLE } from './06-export';
import type { Unit, UnitValue } from './06-export';

// We didn't cover any edge cases yet, so let's do this now
export function convertUnit(from: Unit, to: Unit, value: number): ?number {
  if (from === to) {
    return value;
  }

  // If there is no conversion possible, return null
  // Note how we are using '== null' instead of '=== null'
  // because the first notation will cover both cases, 'null'
  // and 'undefined', which spares us a lot of extra code.
  // You will need to set eslint's 'eqeqeq' rule to '[2, "smart"]'
  if (CONVERSION_TABLE[from] == null || CONVERSION_TABLE[from][to] == null) {
    return null;
  }

  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// Intersection Type for assuming unit to be 'm'
// unit cannot be anything but a `Unit`, so we even
// prevent errors on definition
type MeterUnitValue = {
  unit: 'm'
} & UnitValue;

// Convert whole UnitValues instead of single values
function convertToKm(unitValue: MeterUnitValue): ?UnitValue {
  const { unit, value } = unitValue;
  const converted = convertUnit(unit, 'km', value);

  if (converted == null) {
    return null;
  }

  return {
    unit: 'km',
    value: converted,
  }
}

const value = convertToKm({ unit: 'm', value: 1500 });

assert.deepEqual(value, { unit: 'km', value: 1.5 });
