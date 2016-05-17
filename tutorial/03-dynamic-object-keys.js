/* @flow */

import assert from 'assert';

type Unit = 'm' | 'km' | 'mi';

// We create a type which almost properly types our
// Conversion-Table... but the transform function still
// is defined as `Function` type, which is a very loose
// definition
type ConversionTable = {
  [from: Unit]: {
    [to: Unit]: Function,
  },
};

// We got rid of the any keyword...
// Now we cannot assign a non-Unit value as from / to
const CONVERSION_TABLE: ConversionTable = {
  m: {
    km: (m) => m / 1000,
    mi: (m) => m * 0.000621371,
  },
  // But we can secretly violate our transform interface... that's not good
  km: {
    m: (km) => (km * 1000).toString(),
  },
};

function convertUnit(from: Unit, to: Unit, value: number): number {
  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// 1 km => 1000 m
const value = convertUnit('km', 'm', 1);
assert.equal(value, 1000);
