"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosRetry = _interopRequireDefault(require("axios-retry"));

var _utils = _interopRequireDefault(require("./utils"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var simpleHttpClientFactory = {};

simpleHttpClientFactory.newClient = function (config) {
  function buildCanonicalQueryString(queryParams) {
    // Build a properly encoded query string from a QueryParam object
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    var canonicalQueryString = '';

    for (var property in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, property)) {
        canonicalQueryString += encodeURIComponent(property) + '=' + encodeURIComponent(queryParams[property]) + '&';
      }
    }

    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  var simpleHttpClient = {};
  simpleHttpClient.endpoint = _utils["default"].assertDefined(config.endpoint, 'endpoint');

  simpleHttpClient.makeRequest = function (request) {
    var verb = _utils["default"].assertDefined(request.verb, 'verb');

    var path = _utils["default"].assertDefined(request.path, 'path');

    var queryParams = _utils["default"].copy(request.queryParams);

    var timeout = _utils["default"].copy(request.timeout);

    if (queryParams === undefined) {
      queryParams = {};
    }

    if (timeout === undefined) {
      timeout = 0;
    }

    var headers = _objectSpread(_objectSpread({}, _utils["default"].copy(request.headers)), config.headers); // If the user has not specified an override for Content type the use default


    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    } // If the user has not specified an override for Accept type the use default


    if (headers['Accept'] === undefined) {
      headers['Accept'] = config.defaultAcceptType;
    }

    var body = _utils["default"].copy(request.body);

    var url = config.endpoint + path;
    var queryString = buildCanonicalQueryString(queryParams);

    if (queryString !== '') {
      url += '?' + queryString;
    }

    var simpleHttpRequest = {
      headers: headers,
      timeout: timeout,
      data: body,
      method: verb,
      url: url
    };

    if (config.retries !== undefined) {
      simpleHttpRequest.baseURL = url;

      var client = _axios["default"].create(simpleHttpRequest); // Allow user configurable delay, or built-in exponential delay


      var retryDelay = function retryDelay() {
        return 0;
      };

      if (config.retryDelay === 'exponential') {
        retryDelay = _axiosRetry["default"].exponentialDelay;
      } else if (typeof config.retryDelay === 'number') {
        retryDelay = function retryDelay() {
          return parseInt(config.retryDelay);
        };
      } else if (typeof config.retryDelay === 'function') {
        retryDelay = config.retryDelay;
      }

      (0, _axiosRetry["default"])(client, {
        retries: config.retries,
        retryCondition: typeof config.retryCondition === 'function' ? config.retryCondition : _axiosRetry["default"].isNetworkOrIdempotentRequestError,
        retryDelay: retryDelay
      });
      return client.request(simpleHttpRequest);
    }

    return (0, _axios["default"])(simpleHttpRequest);
  };

  return simpleHttpClient;
};

var _default = simpleHttpClientFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXBpR2F0ZXdheUNvcmUvc2ltcGxlSHR0cENsaWVudC5qcyJdLCJuYW1lcyI6WyJzaW1wbGVIdHRwQ2xpZW50RmFjdG9yeSIsIm5ld0NsaWVudCIsImNvbmZpZyIsImJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmciLCJxdWVyeVBhcmFtcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJjYW5vbmljYWxRdWVyeVN0cmluZyIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyIiwic2ltcGxlSHR0cENsaWVudCIsImVuZHBvaW50IiwidXRpbHMiLCJhc3NlcnREZWZpbmVkIiwibWFrZVJlcXVlc3QiLCJyZXF1ZXN0IiwidmVyYiIsInBhdGgiLCJjb3B5IiwidGltZW91dCIsInVuZGVmaW5lZCIsImhlYWRlcnMiLCJkZWZhdWx0Q29udGVudFR5cGUiLCJkZWZhdWx0QWNjZXB0VHlwZSIsImJvZHkiLCJ1cmwiLCJxdWVyeVN0cmluZyIsInNpbXBsZUh0dHBSZXF1ZXN0IiwiZGF0YSIsIm1ldGhvZCIsInJldHJpZXMiLCJiYXNlVVJMIiwiY2xpZW50IiwiYXhpb3MiLCJjcmVhdGUiLCJyZXRyeURlbGF5IiwiYXhpb3NSZXRyeSIsImV4cG9uZW50aWFsRGVsYXkiLCJwYXJzZUludCIsInJldHJ5Q29uZGl0aW9uIiwiaXNOZXR3b3JrT3JJZGVtcG90ZW50UmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWVBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBRyxFQUFoQzs7QUFDQUEsdUJBQXVCLENBQUNDLFNBQXhCLEdBQW9DLFVBQUNDLE1BQUQsRUFBWTtBQUM5QyxXQUFTQyx5QkFBVCxDQUFtQ0MsV0FBbkMsRUFBZ0Q7QUFDOUM7QUFDQSxRQUFJQyxNQUFNLENBQUNDLElBQVAsQ0FBWUYsV0FBWixFQUF5QkcsTUFBekIsR0FBa0MsQ0FBdEMsRUFBeUM7QUFDdkMsYUFBTyxFQUFQO0FBQ0Q7O0FBRUQsUUFBSUMsb0JBQW9CLEdBQUcsRUFBM0I7O0FBQ0EsU0FBSyxJQUFJQyxRQUFULElBQXFCTCxXQUFyQixFQUFrQztBQUNoQyxVQUFJQyxNQUFNLENBQUNLLFNBQVAsQ0FBaUJDLGNBQWpCLENBQWdDQyxJQUFoQyxDQUFxQ1IsV0FBckMsRUFBa0RLLFFBQWxELENBQUosRUFBaUU7QUFDL0RELFFBQUFBLG9CQUFvQixJQUFJSyxrQkFBa0IsQ0FBQ0osUUFBRCxDQUFsQixHQUNwQixHQURvQixHQUNkSSxrQkFBa0IsQ0FBQ1QsV0FBVyxDQUFDSyxRQUFELENBQVosQ0FESixHQUM4QixHQUR0RDtBQUVEO0FBQ0Y7O0FBRUQsV0FBT0Qsb0JBQW9CLENBQUNNLE1BQXJCLENBQTRCLENBQTVCLEVBQStCTixvQkFBb0IsQ0FBQ0QsTUFBckIsR0FBOEIsQ0FBN0QsQ0FBUDtBQUNEOztBQUVELE1BQUlRLGdCQUFnQixHQUFHLEVBQXZCO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQyxRQUFqQixHQUE0QkMsa0JBQU1DLGFBQU4sQ0FBb0JoQixNQUFNLENBQUNjLFFBQTNCLEVBQXFDLFVBQXJDLENBQTVCOztBQUVBRCxFQUFBQSxnQkFBZ0IsQ0FBQ0ksV0FBakIsR0FBK0IsVUFBU0MsT0FBVCxFQUFrQjtBQUMvQyxRQUFJQyxJQUFJLEdBQUdKLGtCQUFNQyxhQUFOLENBQW9CRSxPQUFPLENBQUNDLElBQTVCLEVBQWtDLE1BQWxDLENBQVg7O0FBQ0EsUUFBSUMsSUFBSSxHQUFHTCxrQkFBTUMsYUFBTixDQUFvQkUsT0FBTyxDQUFDRSxJQUE1QixFQUFrQyxNQUFsQyxDQUFYOztBQUNBLFFBQUlsQixXQUFXLEdBQUdhLGtCQUFNTSxJQUFOLENBQVdILE9BQU8sQ0FBQ2hCLFdBQW5CLENBQWxCOztBQUNBLFFBQUlvQixPQUFPLEdBQUdQLGtCQUFNTSxJQUFOLENBQVdILE9BQU8sQ0FBQ0ksT0FBbkIsQ0FBZDs7QUFDQSxRQUFJcEIsV0FBVyxLQUFLcUIsU0FBcEIsRUFBK0I7QUFDN0JyQixNQUFBQSxXQUFXLEdBQUcsRUFBZDtBQUNEOztBQUNELFFBQUlvQixPQUFPLEtBQUtDLFNBQWhCLEVBQTJCO0FBQ3pCRCxNQUFBQSxPQUFPLEdBQUcsQ0FBVjtBQUNEOztBQUNELFFBQUlFLE9BQU8sbUNBQU9ULGtCQUFNTSxJQUFOLENBQVdILE9BQU8sQ0FBQ00sT0FBbkIsQ0FBUCxHQUF1Q3hCLE1BQU0sQ0FBQ3dCLE9BQTlDLENBQVgsQ0FYK0MsQ0FhL0M7OztBQUNBLFFBQUlBLE9BQU8sQ0FBQyxjQUFELENBQVAsS0FBNEJELFNBQWhDLEVBQTJDO0FBQ3pDQyxNQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLEdBQTBCeEIsTUFBTSxDQUFDeUIsa0JBQWpDO0FBQ0QsS0FoQjhDLENBa0IvQzs7O0FBQ0EsUUFBSUQsT0FBTyxDQUFDLFFBQUQsQ0FBUCxLQUFzQkQsU0FBMUIsRUFBcUM7QUFDbkNDLE1BQUFBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0J4QixNQUFNLENBQUMwQixpQkFBM0I7QUFDRDs7QUFFRCxRQUFJQyxJQUFJLEdBQUdaLGtCQUFNTSxJQUFOLENBQVdILE9BQU8sQ0FBQ1MsSUFBbkIsQ0FBWDs7QUFFQSxRQUFJQyxHQUFHLEdBQUc1QixNQUFNLENBQUNjLFFBQVAsR0FBa0JNLElBQTVCO0FBQ0EsUUFBSVMsV0FBVyxHQUFHNUIseUJBQXlCLENBQUNDLFdBQUQsQ0FBM0M7O0FBQ0EsUUFBSTJCLFdBQVcsS0FBSyxFQUFwQixFQUF3QjtBQUN0QkQsTUFBQUEsR0FBRyxJQUFJLE1BQU1DLFdBQWI7QUFDRDs7QUFFRCxRQUFJQyxpQkFBaUIsR0FBRztBQUN0Qk4sTUFBQUEsT0FBTyxFQUFFQSxPQURhO0FBRXRCRixNQUFBQSxPQUFPLEVBQUVBLE9BRmE7QUFHdEJTLE1BQUFBLElBQUksRUFBRUosSUFIZ0I7QUFJdEJLLE1BQUFBLE1BQU0sRUFBRWIsSUFKYztBQUt0QlMsTUFBQUEsR0FBRyxFQUFFQTtBQUxpQixLQUF4Qjs7QUFPQSxRQUFJNUIsTUFBTSxDQUFDaUMsT0FBUCxLQUFtQlYsU0FBdkIsRUFBa0M7QUFDaENPLE1BQUFBLGlCQUFpQixDQUFDSSxPQUFsQixHQUE0Qk4sR0FBNUI7O0FBQ0EsVUFBSU8sTUFBTSxHQUFHQyxrQkFBTUMsTUFBTixDQUFhUCxpQkFBYixDQUFiLENBRmdDLENBSWhDOzs7QUFDQSxVQUFJUSxVQUFVLEdBQUc7QUFBQSxlQUFNLENBQU47QUFBQSxPQUFqQjs7QUFDQSxVQUFJdEMsTUFBTSxDQUFDc0MsVUFBUCxLQUFzQixhQUExQixFQUF5QztBQUN2Q0EsUUFBQUEsVUFBVSxHQUFHQyx1QkFBV0MsZ0JBQXhCO0FBQ0QsT0FGRCxNQUVPLElBQUksT0FBT3hDLE1BQU0sQ0FBQ3NDLFVBQWQsS0FBNkIsUUFBakMsRUFBMkM7QUFDaERBLFFBQUFBLFVBQVUsR0FBRztBQUFBLGlCQUFNRyxRQUFRLENBQUN6QyxNQUFNLENBQUNzQyxVQUFSLENBQWQ7QUFBQSxTQUFiO0FBQ0QsT0FGTSxNQUVBLElBQUksT0FBT3RDLE1BQU0sQ0FBQ3NDLFVBQWQsS0FBNkIsVUFBakMsRUFBNkM7QUFDbERBLFFBQUFBLFVBQVUsR0FBR3RDLE1BQU0sQ0FBQ3NDLFVBQXBCO0FBQ0Q7O0FBRUQsa0NBQVdILE1BQVgsRUFBbUI7QUFDakJGLFFBQUFBLE9BQU8sRUFBRWpDLE1BQU0sQ0FBQ2lDLE9BREM7QUFFakJTLFFBQUFBLGNBQWMsRUFBRyxPQUFPMUMsTUFBTSxDQUFDMEMsY0FBZCxLQUFpQyxVQUFsQyxHQUFnRDFDLE1BQU0sQ0FBQzBDLGNBQXZELEdBQXdFSCx1QkFBV0ksaUNBRmxGO0FBR2pCTCxRQUFBQSxVQUFVLEVBQVZBO0FBSGlCLE9BQW5CO0FBS0EsYUFBT0gsTUFBTSxDQUFDakIsT0FBUCxDQUFlWSxpQkFBZixDQUFQO0FBQ0Q7O0FBQ0QsV0FBTyx1QkFBTUEsaUJBQU4sQ0FBUDtBQUNELEdBNUREOztBQThEQSxTQUFPakIsZ0JBQVA7QUFDRCxDQXBGRDs7ZUFzRmVmLHVCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDEwLTIwMTYgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuICogWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogQSBjb3B5IG9mIHRoZSBMaWNlbnNlIGlzIGxvY2F0ZWQgYXRcbiAqXG4gKiAgaHR0cDovL2F3cy5hbWF6b24uY29tL2FwYWNoZTIuMFxuICpcbiAqIG9yIGluIHRoZSBcImxpY2Vuc2VcIiBmaWxlIGFjY29tcGFueWluZyB0aGlzIGZpbGUuIFRoaXMgZmlsZSBpcyBkaXN0cmlidXRlZFxuICogb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZ1xuICogcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgYXhpb3NSZXRyeSBmcm9tICdheGlvcy1yZXRyeSc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHNpbXBsZUh0dHBDbGllbnRGYWN0b3J5ID0ge307XG5zaW1wbGVIdHRwQ2xpZW50RmFjdG9yeS5uZXdDbGllbnQgPSAoY29uZmlnKSA9PiB7XG4gIGZ1bmN0aW9uIGJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmcocXVlcnlQYXJhbXMpIHtcbiAgICAvLyBCdWlsZCBhIHByb3Blcmx5IGVuY29kZWQgcXVlcnkgc3RyaW5nIGZyb20gYSBRdWVyeVBhcmFtIG9iamVjdFxuICAgIGlmIChPYmplY3Qua2V5cyhxdWVyeVBhcmFtcykubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGxldCBjYW5vbmljYWxRdWVyeVN0cmluZyA9ICcnO1xuICAgIGZvciAobGV0IHByb3BlcnR5IGluIHF1ZXJ5UGFyYW1zKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHF1ZXJ5UGFyYW1zLCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgY2Fub25pY2FsUXVlcnlTdHJpbmcgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHByb3BlcnR5KVxuICAgICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5UGFyYW1zW3Byb3BlcnR5XSkgKyAnJic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnN1YnN0cigwLCBjYW5vbmljYWxRdWVyeVN0cmluZy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIGxldCBzaW1wbGVIdHRwQ2xpZW50ID0geyB9O1xuICBzaW1wbGVIdHRwQ2xpZW50LmVuZHBvaW50ID0gdXRpbHMuYXNzZXJ0RGVmaW5lZChjb25maWcuZW5kcG9pbnQsICdlbmRwb2ludCcpO1xuXG4gIHNpbXBsZUh0dHBDbGllbnQubWFrZVJlcXVlc3QgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgbGV0IHZlcmIgPSB1dGlscy5hc3NlcnREZWZpbmVkKHJlcXVlc3QudmVyYiwgJ3ZlcmInKTtcbiAgICBsZXQgcGF0aCA9IHV0aWxzLmFzc2VydERlZmluZWQocmVxdWVzdC5wYXRoLCAncGF0aCcpO1xuICAgIGxldCBxdWVyeVBhcmFtcyA9IHV0aWxzLmNvcHkocmVxdWVzdC5xdWVyeVBhcmFtcyk7XG4gICAgbGV0IHRpbWVvdXQgPSB1dGlscy5jb3B5KHJlcXVlc3QudGltZW91dCk7XG4gICAgaWYgKHF1ZXJ5UGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHF1ZXJ5UGFyYW1zID0ge307XG4gICAgfVxuICAgIGlmICh0aW1lb3V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBsZXQgaGVhZGVycyA9IHsuLi51dGlscy5jb3B5KHJlcXVlc3QuaGVhZGVycyksIC4uLmNvbmZpZy5oZWFkZXJzfTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3Qgc3BlY2lmaWVkIGFuIG92ZXJyaWRlIGZvciBDb250ZW50IHR5cGUgdGhlIHVzZSBkZWZhdWx0XG4gICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gY29uZmlnLmRlZmF1bHRDb250ZW50VHlwZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoYXMgbm90IHNwZWNpZmllZCBhbiBvdmVycmlkZSBmb3IgQWNjZXB0IHR5cGUgdGhlIHVzZSBkZWZhdWx0XG4gICAgaWYgKGhlYWRlcnNbJ0FjY2VwdCddID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gY29uZmlnLmRlZmF1bHRBY2NlcHRUeXBlO1xuICAgIH1cblxuICAgIGxldCBib2R5ID0gdXRpbHMuY29weShyZXF1ZXN0LmJvZHkpO1xuXG4gICAgbGV0IHVybCA9IGNvbmZpZy5lbmRwb2ludCArIHBhdGg7XG4gICAgbGV0IHF1ZXJ5U3RyaW5nID0gYnVpbGRDYW5vbmljYWxRdWVyeVN0cmluZyhxdWVyeVBhcmFtcyk7XG4gICAgaWYgKHF1ZXJ5U3RyaW5nICE9PSAnJykge1xuICAgICAgdXJsICs9ICc/JyArIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGxldCBzaW1wbGVIdHRwUmVxdWVzdCA9IHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgZGF0YTogYm9keSxcbiAgICAgIG1ldGhvZDogdmVyYixcbiAgICAgIHVybDogdXJsLFxuICAgIH07XG4gICAgaWYgKGNvbmZpZy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNpbXBsZUh0dHBSZXF1ZXN0LmJhc2VVUkwgPSB1cmw7XG4gICAgICBsZXQgY2xpZW50ID0gYXhpb3MuY3JlYXRlKHNpbXBsZUh0dHBSZXF1ZXN0KTtcblxuICAgICAgLy8gQWxsb3cgdXNlciBjb25maWd1cmFibGUgZGVsYXksIG9yIGJ1aWx0LWluIGV4cG9uZW50aWFsIGRlbGF5XG4gICAgICBsZXQgcmV0cnlEZWxheSA9ICgpID0+IDA7XG4gICAgICBpZiAoY29uZmlnLnJldHJ5RGVsYXkgPT09ICdleHBvbmVudGlhbCcpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9IGF4aW9zUmV0cnkuZXhwb25lbnRpYWxEZWxheTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5yZXRyeURlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXRyeURlbGF5ID0gKCkgPT4gcGFyc2VJbnQoY29uZmlnLnJldHJ5RGVsYXkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLnJldHJ5RGVsYXkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9IGNvbmZpZy5yZXRyeURlbGF5O1xuICAgICAgfVxuXG4gICAgICBheGlvc1JldHJ5KGNsaWVudCwge1xuICAgICAgICByZXRyaWVzOiBjb25maWcucmV0cmllcyxcbiAgICAgICAgcmV0cnlDb25kaXRpb246ICh0eXBlb2YgY29uZmlnLnJldHJ5Q29uZGl0aW9uID09PSAnZnVuY3Rpb24nKSA/IGNvbmZpZy5yZXRyeUNvbmRpdGlvbiA6IGF4aW9zUmV0cnkuaXNOZXR3b3JrT3JJZGVtcG90ZW50UmVxdWVzdEVycm9yLFxuICAgICAgICByZXRyeURlbGF5LFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2xpZW50LnJlcXVlc3Qoc2ltcGxlSHR0cFJlcXVlc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXhpb3Moc2ltcGxlSHR0cFJlcXVlc3QpO1xuICB9O1xuXG4gIHJldHVybiBzaW1wbGVIdHRwQ2xpZW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2ltcGxlSHR0cENsaWVudEZhY3Rvcnk7XG4iXX0=