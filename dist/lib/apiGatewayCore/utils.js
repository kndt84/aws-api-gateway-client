"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* eslint max-len: ["error", 100]*/
var utils = {
  assertDefined: function assertDefined(object, name) {
    if (object === undefined) {
      throw new Error("".concat(name, " must be defined"));
    } else {
      return object;
    }
  },
  assertParametersDefined: function assertParametersDefined(params, keys, ignore) {
    if (keys === undefined) {
      return;
    }

    if (keys.length > 0 && params === undefined) {
      params = {};
    }

    for (var i = 0; i < keys.length; i++) {
      if (!utils.contains(ignore, keys[i])) {
        utils.assertDefined(params[keys[i]], keys[i]);
      }
    }
  },
  parseParametersToObject: function parseParametersToObject(params, keys) {
    if (params === undefined) {
      return {};
    }

    var object = {};

    for (var i = 0; i < keys.length; i++) {
      object[keys[i]] = params[keys[i]];
    }

    return object;
  },
  contains: function contains(a, obj) {
    if (a === undefined) {
      return false;
    }

    var i = a.length;

    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }

    return false;
  },
  copy: function copy(obj) {
    if (null === obj || 'object' !== (0, _typeof2["default"])(obj)) return obj;
    if (Buffer.isBuffer(obj)) return Buffer.from(obj);
    var copy = obj.constructor();
    var attr = null;

    for (attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, "attr")) copy[attr] = obj[attr];
    }

    return copy;
  },
  mergeInto: function mergeInto(baseObj, additionalProps) {
    if (null === baseObj || 'object' !== (0, _typeof2["default"])(baseObj)) return baseObj;
    var merged = baseObj.constructor();
    var attr = null;

    for (attr in baseObj) {
      if (Object.prototype.hasOwnProperty.call(baseObj, "attr")) merged[attr] = baseObj[attr];
    }

    if (null == additionalProps || 'object' != (0, _typeof2["default"])(additionalProps)) return baseObj;

    for (attr in additionalProps) {
      if (Object.prototype.hasOwnProperty.call(additionalProps, "attr")) {
        merged[attr] = additionalProps[attr];
      }
    }

    return merged;
  }
};
var _default = utils;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXBpR2F0ZXdheUNvcmUvdXRpbHMuanMiXSwibmFtZXMiOlsidXRpbHMiLCJhc3NlcnREZWZpbmVkIiwib2JqZWN0IiwibmFtZSIsInVuZGVmaW5lZCIsIkVycm9yIiwiYXNzZXJ0UGFyYW1ldGVyc0RlZmluZWQiLCJwYXJhbXMiLCJrZXlzIiwiaWdub3JlIiwibGVuZ3RoIiwiaSIsImNvbnRhaW5zIiwicGFyc2VQYXJhbWV0ZXJzVG9PYmplY3QiLCJhIiwib2JqIiwiY29weSIsIkJ1ZmZlciIsImlzQnVmZmVyIiwiZnJvbSIsImNvbnN0cnVjdG9yIiwiYXR0ciIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIm1lcmdlSW50byIsImJhc2VPYmoiLCJhZGRpdGlvbmFsUHJvcHMiLCJtZXJnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQWNBO0FBRUEsSUFBTUEsS0FBSyxHQUFHO0FBQ1pDLEVBQUFBLGFBQWEsRUFBRSx1QkFBU0MsTUFBVCxFQUFpQkMsSUFBakIsRUFBdUI7QUFDcEMsUUFBSUQsTUFBTSxLQUFLRSxTQUFmLEVBQTBCO0FBQ3hCLFlBQU0sSUFBSUMsS0FBSixXQUFhRixJQUFiLHNCQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBT0QsTUFBUDtBQUNEO0FBQ0YsR0FQVztBQVFaSSxFQUFBQSx1QkFBdUIsRUFBRSxpQ0FBU0MsTUFBVCxFQUFpQkMsSUFBakIsRUFBdUJDLE1BQXZCLEVBQStCO0FBQ3RELFFBQUlELElBQUksS0FBS0osU0FBYixFQUF3QjtBQUN0QjtBQUNEOztBQUNELFFBQUlJLElBQUksQ0FBQ0UsTUFBTCxHQUFjLENBQWQsSUFBbUJILE1BQU0sS0FBS0gsU0FBbEMsRUFBNkM7QUFDM0NHLE1BQUFBLE1BQU0sR0FBRyxFQUFUO0FBQ0Q7O0FBQ0QsU0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFH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TixJQUFMLElBQWFPLGVBQWIsRUFBOEI7QUFDNUIsVUFBSU4sTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxjQUFqQixDQUFnQ0MsSUFBaEMsQ0FBcUNHLGVBQXJDLEVBQXNELE1BQXRELENBQUosRUFBbUU7QUFDakVDLFFBQUFBLE1BQU0sQ0FBQ1IsSUFBRCxDQUFOLEdBQWVPLGVBQWUsQ0FBQ1AsSUFBRCxDQUE5QjtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT1EsTUFBUDtBQUNEO0FBbkVXLENBQWQ7ZUFzRWU3QixLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDEwLTIwMTYgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuICogWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogQSBjb3B5IG9mIHRoZSBMaWNlbnNlIGlzIGxvY2F0ZWQgYXRcbiAqXG4gKiAgaHR0cDovL2F3cy5hbWF6b24uY29tL2FwYWNoZTIuMFxuICpcbiAqIG9yIGluIHRoZSBcImxpY2Vuc2VcIiBmaWxlIGFjY29tcGFueWluZyB0aGlzIGZpbGUuIFRoaXMgZmlsZSBpcyBkaXN0cmlidXRlZFxuICogb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZ1xuICogcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKiBlc2xpbnQgbWF4LWxlbjogW1wiZXJyb3JcIiwgMTAwXSovXG5cbmNvbnN0IHV0aWxzID0ge1xuICBhc3NlcnREZWZpbmVkOiBmdW5jdGlvbihvYmplY3QsIG5hbWUpIHtcbiAgICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfSBtdXN0IGJlIGRlZmluZWRgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gIH0sXG4gIGFzc2VydFBhcmFtZXRlcnNEZWZpbmVkOiBmdW5jdGlvbihwYXJhbXMsIGtleXMsIGlnbm9yZSkge1xuICAgIGlmIChrZXlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGtleXMubGVuZ3RoID4gMCAmJiBwYXJhbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcGFyYW1zID0ge307XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCF1dGlscy5jb250YWlucyhpZ25vcmUsIGtleXNbaV0pKSB7XG4gICAgICAgIHV0aWxzLmFzc2VydERlZmluZWQocGFyYW1zW2tleXNbaV1dLCBrZXlzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHBhcnNlUGFyYW1ldGVyc1RvT2JqZWN0OiBmdW5jdGlvbihwYXJhbXMsIGtleXMpIHtcbiAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgbGV0IG9iamVjdCA9IHsgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdFtrZXlzW2ldXSA9IHBhcmFtc1trZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKGEsIG9iaikge1xuICAgIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IGkgPSBhLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAoYVtpXSA9PT0gb2JqKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGNvcHk6IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChudWxsID09PSBvYmogfHwgJ29iamVjdCcgIT09IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XG4gICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSByZXR1cm4gQnVmZmVyLmZyb20ob2JqKTtcbiAgICBsZXQgY29weSA9IG9iai5jb25zdHJ1Y3RvcigpO1xuICAgIGxldCBhdHRyID0gbnVsbDtcbiAgICBmb3IgKGF0dHIgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgXCJhdHRyXCIpKSBjb3B5W2F0dHJdID0gb2JqW2F0dHJdO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbiAgfSxcbiAgbWVyZ2VJbnRvOiBmdW5jdGlvbihiYXNlT2JqLCBhZGRpdGlvbmFsUHJvcHMpIHtcbiAgICBpZiAobnVsbCA9PT0gYmFzZU9iaiB8fCAnb2JqZWN0JyAhPT0gdHlwZW9mIGJhc2VPYmopIHJldHVybiBiYXNlT2JqO1xuICAgIGxldCBtZXJnZWQgPSBiYXNlT2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgbGV0IGF0dHIgPSBudWxsO1xuICAgIGZvciAoYXR0ciBpbiBiYXNlT2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGJhc2VPYmosIFwiYXR0clwiKSkgbWVyZ2VkW2F0dHJdID0gYmFzZU9ialthdHRyXTtcbiAgICB9XG4gICAgaWYgKG51bGwgPT0gYWRkaXRpb25hbFByb3BzIHx8ICdvYmplY3QnICE9IHR5cGVvZiBhZGRpdGlvbmFsUHJvcHMpIHJldHVybiBiYXNlT2JqO1xuICAgIGZvciAoYXR0ciBpbiBhZGRpdGlvbmFsUHJvcHMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYWRkaXRpb25hbFByb3BzLCBcImF0dHJcIikpIHtcbiAgICAgICAgbWVyZ2VkW2F0dHJdID0gYWRkaXRpb25hbFByb3BzW2F0dHJdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1dGlscztcbiJdfQ==