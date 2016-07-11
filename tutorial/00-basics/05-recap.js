/* @flow */

/**
 * The `type` keyword indicates that this is a
 * flow specific declaration. These declarations
 * are not part of the distributed code!
 */

// Enum / Union Type
type Unit = 'm' | 'km';

// Function type
type ConvertFn = (value: number) => number;

// Applied generic types
type VariadicFn = (...args: Array<number>) => Object;

// Object structure
type UnitValue = {
  unit: Unit,
  value: number,
}

// Object structure with dynamic keys
type ConversionTable = {
  [from: Unit]: {
    [to: Unit]: ConvertFn,
  },
};

// Actual function with typed parameters
function createMeterValue(value): UnitValue {
  return {
    unit: 'm',
    value,
  };
}

// Because flow knows about it's return type
// UnitValue, it knows that value needs to
// be a number
function guessParamType(value): UnitValue {
  return {
    unit: 'km',
    value,
  };
}

guessParamType(100);

// $FlowExpectedError: A string is not valid for UnitValue#value
guessParamType('100');
