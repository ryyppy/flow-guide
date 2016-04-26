/* @flow */

// Types can be exported, like real ES6 code!
export type Unit = 'm' | 'km' | 'mi';
export type ConvertFn = (value: number) => number;
export type UnitValue = {
  unit: Unit,
  value: number,
};
export type ConvertionTable = {
  [from: Unit]: {
    [to: Unit]: ConvertFn,
  },
};

// Real code will be exported as usual
export const CONVERTION_TABLE: ConvertionTable = {
  m: {
    km: (m) => m / 1000,
    mi: (m) => m * 0.000621371,
  },
  km: {
    // This does not work anymore... we get a warning
    m: (km) => (km * 1000)/*.toString()*/, 
  }
};

export function convertUnit(from: Unit, to: Unit, value: number): number {
  const transform = CONVERTION_TABLE[from][to];

  return transform(value);
}
