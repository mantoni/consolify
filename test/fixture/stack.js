'use strict';

try {
  throw new Error('ouch!');
} catch (e) {
  console.log(e.stack);
}
