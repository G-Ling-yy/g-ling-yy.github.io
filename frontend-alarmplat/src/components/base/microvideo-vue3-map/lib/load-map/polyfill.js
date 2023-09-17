import RemoGeoLocation from './remote';

/**
 * assign pollyfill
 * @param  {Object} target
 * @param  {Object} varArgs
 * @return
 */
export function assign(target, varArgs) {
  if (typeof Object.assign !== 'function') {
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  } else {
    return Object.assign.apply(Object, arguments);
  }
}

export function patchIOS11Geo() {
  if (AMap.UA.ios && document.location.protocol !== 'https:') {
    var remoGeo = new RemoGeoLocation();
    navigator.geolocation.getCurrentPosition = function() {
      return remoGeo.getCurrentPosition.apply(remoGeo, arguments);
    };
    navigator.geolocation.watchPosition = function() {
      return remoGeo.watchPosition.apply(remoGeo, arguments);
    };
  }
}