/* @flow */

import assert from 'assert';
import { convertUnit } from './08-maybe-and-optionals';
import type { Unit, UnitValue } from './06-export';

// Most of the time we need async operations to query
// our server / do some other IO and such...
// For this we are used to Promises, so let's see
// how Promises work in flow


function convertUnitValue(to: Unit, unitValue: UnitValue): UnitValue {
  const { unit, value } = unitValue;

  const convertedValue = convertUnit(unit, to, value);

  if (convertedValue == null) {
    return { unit, value };
  }

  return {
    unit: to,
    value: convertedValue
  };
}

// We simulate a request by just returning a successful Promise
// Note that we usually have to make sure to validate returned
// data, before we unleash it in our clean typed code
function readUnitValues(): Promise<Array<UnitValue>> {
  return Promise.resolve([
    { unit: 'm', value: 1000 },
    { unit: 'km', value: 1.5 },
  ]);
}

const promise = readUnitValues().then((result) => {
    const [ value1, value2 ] = result;

    assert.deepEqual(value1, { unit: 'm', value: 1000 });
    assert.deepEqual(value2, { unit: 'km', value: 1.5 });

    console.log('Initially read values:');
    console.log(result);

    return result.map((value) => convertUnitValue('km', value));
  })
  .then((converted) => {
    const [ conv1, conv2 ] = converted;

    assert.deepEqual(conv1, { unit: 'km', value: 1 });
    assert.deepEqual(conv2, { unit: 'km', value: 1.5 });

    console.log('Converted values:');
    console.log(converted);
  })
  .catch((err) => {
    console.log('Unexpected Error occurred!');
    console.log(err);
    throw err;
  });

// $FlowExpectedError: Flow notices that this is a Promise, so this should trigger a warning
promise.foo;
