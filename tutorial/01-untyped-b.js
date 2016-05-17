const METER = 'm';
const KILOMETER = 'km';
const MILE = 'mi';

const CONVERSION_TABLE = {
  [METER]: {
    [KILOMETER]: (m) => m / 1000,
    [MILE]: (m) => m * 0.000621371,
  },
};

// Converts a value from one unit to another
// by using our internal totally awesome conversion
// table. Returns a new UnitValue object.
function convertUnit(from, to, value) {
  const transform = CONVERSION_TABLE[from][to];

  return transform(value);
}

// So now we are using constants, which might be safer with ESlint
convertUnit(METER, KILOMETER, 1000)

// But this doesn't protect us from misuse and will throw an 'undefined' error
convertUnit('cm', 'm', 100);
