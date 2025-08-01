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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

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

      (0, _axiosRetry["default"])(client, _objectSpread(_objectSpread({}, config), {}, {
        retryCondition: typeof config.retryCondition === 'function' ? config.retryCondition : _axiosRetry["default"].isNetworkOrIdempotentRequestError,
        retryDelay: retryDelay
      }));
      return client.request(simpleHttpRequest);
    }

    return (0, _axios["default"])(simpleHttpRequest);
  };

  return simpleHttpClient;
};

var _default = simpleHttpClientFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXBpR2F0ZXdheUNvcmUvc2ltcGxlSHR0cENsaWVudC5qcyJdLCJuYW1lcyI6WyJzaW1wbGVIdHRwQ2xpZW50RmFjdG9yeSIsIm5ld0NsaWVudCIsImNvbmZpZyIsImJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmciLCJxdWVyeVBhcmFtcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJjYW5vbmljYWxRdWVyeVN0cmluZyIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyIiwic2ltcGxlSHR0cENsaWVudCIsImVuZHBvaW50IiwidXRpbHMiLCJhc3NlcnREZWZpbmVkIiwibWFrZVJlcXVlc3QiLCJyZXF1ZXN0IiwidmVyYiIsInBhdGgiLCJjb3B5IiwidGltZW91dCIsInVuZGVmaW5lZCIsImhlYWRlcnMiLCJkZWZhdWx0Q29udGVudFR5cGUiLCJkZWZhdWx0QWNjZXB0VHlwZSIsImJvZHkiLCJ1cmwiLCJxdWVyeVN0cmluZyIsInNpbXBsZUh0dHBSZXF1ZXN0IiwiZGF0YSIsIm1ldGhvZCIsInJldHJpZXMiLCJiYXNlVVJMIiwiY2xpZW50IiwiYXhpb3MiLCJjcmVhdGUiLCJyZXRyeURlbGF5IiwiYXhpb3NSZXRyeSIsImV4cG9uZW50aWFsRGVsYXkiLCJwYXJzZUludCIsInJldHJ5Q29uZGl0aW9uIiwiaXNOZXR3b3JrT3JJZGVtcG90ZW50UmVxdWVzdEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWVBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBRyxFQUFoQzs7QUFDQUEsdUJBQXVCLENBQUNDLFNBQXhCLEdBQW9DLFVBQUNDLE1BQUQsRUFBWTtBQUM5QyxXQUFTQyx5QkFBVCxDQUFtQ0MsV0FBbkMsRUFBZ0Q7QUFDOUM7QUFDQSxRQUFJQyxNQUFNLENBQUNDLElBQVAsQ0FBWUYsV0FBWixFQUF5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bmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIikuXG4gKiBZb3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBBIGNvcHkgb2YgdGhlIExpY2Vuc2UgaXMgbG9jYXRlZCBhdFxuICpcbiAqICBodHRwOi8vYXdzLmFtYXpvbi5jb20vYXBhY2hlMi4wXG4gKlxuICogb3IgaW4gdGhlIFwibGljZW5zZVwiIGZpbGUgYWNjb21wYW55aW5nIHRoaXMgZmlsZS4gVGhpcyBmaWxlIGlzIGRpc3RyaWJ1dGVkXG4gKiBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nXG4gKiBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCBheGlvc1JldHJ5IGZyb20gJ2F4aW9zLXJldHJ5JztcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcblxuY29uc3Qgc2ltcGxlSHR0cENsaWVudEZhY3RvcnkgPSB7fTtcbnNpbXBsZUh0dHBDbGllbnRGYWN0b3J5Lm5ld0NsaWVudCA9IChjb25maWcpID0+IHtcbiAgZnVuY3Rpb24gYnVpbGRDYW5vbmljYWxRdWVyeVN0cmluZyhxdWVyeVBhcmFtcykge1xuICAgIC8vIEJ1aWxkIGEgcHJvcGVybHkgZW5jb2RlZCBxdWVyeSBzdHJpbmcgZnJvbSBhIFF1ZXJ5UGFyYW0gb2JqZWN0XG4gICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgbGV0IGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gJyc7XG4gICAgZm9yIChsZXQgcHJvcGVydHkgaW4gcXVlcnlQYXJhbXMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocXVlcnlQYXJhbXMsIHByb3BlcnR5KSkge1xuICAgICAgICBjYW5vbmljYWxRdWVyeVN0cmluZyArPSBlbmNvZGVVUklDb21wb25lbnQocHJvcGVydHkpXG4gICAgICAgICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocXVlcnlQYXJhbXNbcHJvcGVydHldKSArICcmJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2Fub25pY2FsUXVlcnlTdHJpbmcuc3Vic3RyKDAsIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgbGV0IHNpbXBsZUh0dHBDbGllbnQgPSB7IH07XG4gIHNpbXBsZUh0dHBDbGllbnQuZW5kcG9pbnQgPSB1dGlscy5hc3NlcnREZWZpbmVkKGNvbmZpZy5lbmRwb2ludCwgJ2VuZHBvaW50Jyk7XG5cbiAgc2ltcGxlSHR0cENsaWVudC5tYWtlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICBsZXQgdmVyYiA9IHV0aWxzLmFzc2VydERlZmluZWQocmVxdWVzdC52ZXJiLCAndmVyYicpO1xuICAgIGxldCBwYXRoID0gdXRpbHMuYXNzZXJ0RGVmaW5lZChyZXF1ZXN0LnBhdGgsICdwYXRoJyk7XG4gICAgbGV0IHF1ZXJ5UGFyYW1zID0gdXRpbHMuY29weShyZXF1ZXN0LnF1ZXJ5UGFyYW1zKTtcbiAgICBsZXQgdGltZW91dCA9IHV0aWxzLmNvcHkocmVxdWVzdC50aW1lb3V0KTtcbiAgICBpZiAocXVlcnlQYXJhbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcXVlcnlQYXJhbXMgPSB7fTtcbiAgICB9XG4gICAgaWYgKHRpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIGxldCBoZWFkZXJzID0gey4uLnV0aWxzLmNvcHkocmVxdWVzdC5oZWFkZXJzKSwgLi4uY29uZmlnLmhlYWRlcnN9O1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGFzIG5vdCBzcGVjaWZpZWQgYW4gb3ZlcnJpZGUgZm9yIENvbnRlbnQgdHlwZSB0aGUgdXNlIGRlZmF1bHRcbiAgICBpZiAoaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBjb25maWcuZGVmYXVsdENvbnRlbnRUeXBlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3Qgc3BlY2lmaWVkIGFuIG92ZXJyaWRlIGZvciBBY2NlcHQgdHlwZSB0aGUgdXNlIGRlZmF1bHRcbiAgICBpZiAoaGVhZGVyc1snQWNjZXB0J10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGVhZGVyc1snQWNjZXB0J10gPSBjb25maWcuZGVmYXVsdEFjY2VwdFR5cGU7XG4gICAgfVxuXG4gICAgbGV0IGJvZHkgPSB1dGlscy5jb3B5KHJlcXVlc3QuYm9keSk7XG5cbiAgICBsZXQgdXJsID0gY29uZmlnLmVuZHBvaW50ICsgcGF0aDtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSBidWlsZENhbm9uaWNhbFF1ZXJ5U3RyaW5nKHF1ZXJ5UGFyYW1zKTtcbiAgICBpZiAocXVlcnlTdHJpbmcgIT09ICcnKSB7XG4gICAgICB1cmwgKz0gJz8nICsgcXVlcnlTdHJpbmc7XG4gICAgfVxuXG4gICAgbGV0IHNpbXBsZUh0dHBSZXF1ZXN0ID0ge1xuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICBkYXRhOiBib2R5LFxuICAgICAgbWV0aG9kOiB2ZXJiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgfTtcbiAgICBpZiAoY29uZmlnLnJldHJpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2ltcGxlSHR0cFJlcXVlc3QuYmFzZVVSTCA9IHVybDtcbiAgICAgIGxldCBjbGllbnQgPSBheGlvcy5jcmVhdGUoc2ltcGxlSHR0cFJlcXVlc3QpO1xuXG4gICAgICAvLyBBbGxvdyB1c2VyIGNvbmZpZ3VyYWJsZSBkZWxheSwgb3IgYnVpbHQtaW4gZXhwb25lbnRpYWwgZGVsYXlcbiAgICAgIGxldCByZXRyeURlbGF5ID0gKCkgPT4gMDtcbiAgICAgIGlmIChjb25maWcucmV0cnlEZWxheSA9PT0gJ2V4cG9uZW50aWFsJykge1xuICAgICAgICByZXRyeURlbGF5ID0gYXhpb3NSZXRyeS5leHBvbmVudGlhbERlbGF5O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLnJldHJ5RGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHJ5RGVsYXkgPSAoKSA9PiBwYXJzZUludChjb25maWcucmV0cnlEZWxheSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcucmV0cnlEZWxheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXRyeURlbGF5ID0gY29uZmlnLnJldHJ5RGVsYXk7XG4gICAgICB9XG5cbiAgICAgIGF4aW9zUmV0cnkoY2xpZW50LCB7XG4gICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgcmV0cnlDb25kaXRpb246ICh0eXBlb2YgY29uZmlnLnJldHJ5Q29uZGl0aW9uID09PSAnZnVuY3Rpb24nKSA/IGNvbmZpZy5yZXRyeUNvbmRpdGlvbiA6IGF4aW9zUmV0cnkuaXNOZXR3b3JrT3JJZGVtcG90ZW50UmVxdWVzdEVycm9yLFxuICAgICAgICByZXRyeURlbGF5LFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2xpZW50LnJlcXVlc3Qoc2ltcGxlSHR0cFJlcXVlc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXhpb3Moc2ltcGxlSHR0cFJlcXVlc3QpO1xuICB9O1xuXG4gIHJldHVybiBzaW1wbGVIdHRwQ2xpZW50O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2ltcGxlSHR0cENsaWVudEZhY3Rvcnk7XG4iXX0=