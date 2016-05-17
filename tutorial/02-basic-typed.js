/* @flow */

const CONVERSION_TABLE = {
  m: {
    km: (m) => m / 1000,
    mi: (m) => m * 0.000621371,
  }
};

function convertUnit(from: string, to: string, value: number): number {
  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// Will return 1
convertUnit('m', 'km', 1000);

// This error goes unnoticed during development...
// Especially hard to debug if you use variables for 'from' & 'to'
convertUnit('cm', 'm', 100);
