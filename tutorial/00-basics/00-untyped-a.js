const CONVERSION_TABLE = {
  m: {
    km: (m) => m / 1000,
    mi: (m) => m * 0.000621371,
  },
};

// Converts a value from one unit to another
// by using our internal totally awesome conversion
// table. Returns a new UnitValue object.
function convertUnit(from, to, value) {
  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// Will return 1
convertUnit('m', 'km', 1000);

// Will return ?
convertUnit('cm', 'm', 100);
