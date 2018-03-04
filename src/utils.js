'use strict';

module.exports = {
  forwardRouteError: fn => (...args) => fn(...args).catch(args[2]),
};
