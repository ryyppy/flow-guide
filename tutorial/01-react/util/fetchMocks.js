/* @flow */

import type {
  User,
  RunSession,
} from '../00-intro'; 

export function fetchRunSessions(): Promise<Array<RunSession>> {
  return Promise.resolve([
    {
      duration: 108000000,
      distance: 6,
      user: {
        id: 'u1',
        username: 'fgschwandtner',
        firstname: 'Florian',
        lastname: 'Gschwandtner',
        premium: true,
      }
    },
    {
      duration: 100002340,
      distance: 8,
      user: {
        id: 'u2',
        username: 'ckaar',
        firstname: 'Christian',
        lastname: 'Kaar',
        premium: false,
      }
    },
  ]);
}
