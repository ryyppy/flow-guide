/* @flow */

type Unit = 'm' | 'km' | 'mi';

// We introduce a type for our transform function
type ConvertFn = (value: number) => number;

type ConversionTable = {
  [from: Unit]: {
    [to: Unit]: ConvertFn, // Now we make sure we only use the proper interface
  },
};

const CONVERSION_TABLE: ConversionTable = {
  m: {
    km: (m) => m / 1000,
    mi: (m) => m * 0.000621371,
  },
  km: {
    // This does not work anymore... we get a warning
    m: (km) => (km * 1000)/*.toString()*/,
  }
};

function convertUnit(from: Unit, to: Unit, value: number): number {
  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// Should return 1000
convertUnit('km', 'm', 1);
