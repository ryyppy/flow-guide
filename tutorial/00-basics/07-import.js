/* @flow */

import { convertUnit } from './06-export';

// $FlowExpectedError: Flow recognized non-existent symbols and even recognizes typos!
import { conveRtUnit } from './06-export';

// Types are imported independently from 'real' code
// Flow kinda doesn't differentiate between 'real' and 'type' code
import type { Unit } from './06-export';
