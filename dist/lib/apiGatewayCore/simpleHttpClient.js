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
      if (Object.prototype.hasOwnProperty.call(queryParams, "property")) {
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

    var headers = _objectSpread({}, _utils["default"].copy(request.headers), {}, config.headers); // If the user has not specified an override for Content type the use default


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
      data: body
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
        retryCondition: config.retryCondition,
        retryDelay: retryDelay
      });
      return client.request({
        method: verb
      });
    }

    simpleHttpRequest.method = verb;
    simpleHttpRequest.url = url;
    return (0, _axios["default"])(simpleHttpRequest);
  };

  return simpleHttpClient;
};

var _default = simpleHttpClientFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXBpR2F0ZXdheUNvcmUvc2ltcGxlSHR0cENsaWVudC5qcyJdLCJuYW1lcyI6WyJzaW1wbGVIdHRwQ2xpZW50RmFjdG9yeSIsIm5ld0NsaWVudCIsImNvbmZpZyIsImJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmciLCJxdWVyeVBhcmFtcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJjYW5vbmljYWxRdWVyeVN0cmluZyIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyIiwic2ltcGxlSHR0cENsaWVudCIsImVuZHBvaW50IiwidXRpbHMiLCJhc3NlcnREZWZpbmVkIiwibWFrZVJlcXVlc3QiLCJyZXF1ZXN0IiwidmVyYiIsInBhdGgiLCJjb3B5IiwidGltZW91dCIsInVuZGVmaW5lZCIsImhlYWRlcnMiLCJkZWZhdWx0Q29udGVudFR5cGUiLCJkZWZhdWx0QWNjZXB0VHlwZSIsImJvZHkiLCJ1cmwiLCJxdWVyeVN0cmluZyIsInNpbXBsZUh0dHBSZXF1ZXN0IiwiZGF0YSIsInJldHJpZXMiLCJiYXNlVVJMIiwiY2xpZW50IiwiYXhpb3MiLCJjcmVhdGUiLCJyZXRyeURlbGF5IiwiYXhpb3NSZXRyeSIsImV4cG9uZW50aWFsRGVsYXkiLCJwYXJzZUludCIsInJldHJ5Q29uZGl0aW9uIiwibWV0aG9kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWVBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBRyxFQUFoQzs7QUFDQUEsdUJBQXVCLENBQUNDLFNBQXhCLEdBQW9DLFVBQUNDLE1BQUQsRUFBWTtBQUM5QyxXQUFTQyx5QkFBVCxDQUFtQ0MsV0FBbkMsRUFBZ0Q7QUFDOUM7QUFDQSxRQUFJQyxNQUFNLENBQUNDLElBQVAsQ0FBWUYsV0FBWixFQUF5QkcsTUFBekIsR0FBa0MsQ0FBdEMsRUFBeUM7QUFDdkMsYUFB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bmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIikuXG4gKiBZb3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBBIGNvcHkgb2YgdGhlIExpY2Vuc2UgaXMgbG9jYXRlZCBhdFxuICpcbiAqICBodHRwOi8vYXdzLmFtYXpvbi5jb20vYXBhY2hlMi4wXG4gKlxuICogb3IgaW4gdGhlIFwibGljZW5zZVwiIGZpbGUgYWNjb21wYW55aW5nIHRoaXMgZmlsZS4gVGhpcyBmaWxlIGlzIGRpc3RyaWJ1dGVkXG4gKiBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nXG4gKiBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCBheGlvc1JldHJ5IGZyb20gJ2F4aW9zLXJldHJ5JztcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcblxuY29uc3Qgc2ltcGxlSHR0cENsaWVudEZhY3RvcnkgPSB7fTtcbnNpbXBsZUh0dHBDbGllbnRGYWN0b3J5Lm5ld0NsaWVudCA9IChjb25maWcpID0+IHtcbiAgZnVuY3Rpb24gYnVpbGRDYW5vbmljYWxRdWVyeVN0cmluZyhxdWVyeVBhcmFtcykge1xuICAgIC8vIEJ1aWxkIGEgcHJvcGVybHkgZW5jb2RlZCBxdWVyeSBzdHJpbmcgZnJvbSBhIFF1ZXJ5UGFyYW0gb2JqZWN0XG4gICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5UGFyYW1zKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgbGV0IGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gJyc7XG4gICAgZm9yIChsZXQgcHJvcGVydHkgaW4gcXVlcnlQYXJhbXMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocXVlcnlQYXJhbXMsIFwicHJvcGVydHlcIikpIHtcbiAgICAgICAgY2Fub25pY2FsUXVlcnlTdHJpbmcgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHByb3BlcnR5KVxuICAgICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5UGFyYW1zW3Byb3BlcnR5XSkgKyAnJic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnN1YnN0cigwLCBjYW5vbmljYWxRdWVyeVN0cmluZy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIGxldCBzaW1wbGVIdHRwQ2xpZW50ID0geyB9O1xuICBzaW1wbGVIdHRwQ2xpZW50LmVuZHBvaW50ID0gdXRpbHMuYXNzZXJ0RGVmaW5lZChjb25maWcuZW5kcG9pbnQsICdlbmRwb2ludCcpO1xuXG4gIHNpbXBsZUh0dHBDbGllbnQubWFrZVJlcXVlc3QgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgbGV0IHZlcmIgPSB1dGlscy5hc3NlcnREZWZpbmVkKHJlcXVlc3QudmVyYiwgJ3ZlcmInKTtcbiAgICBsZXQgcGF0aCA9IHV0aWxzLmFzc2VydERlZmluZWQocmVxdWVzdC5wYXRoLCAncGF0aCcpO1xuICAgIGxldCBxdWVyeVBhcmFtcyA9IHV0aWxzLmNvcHkocmVxdWVzdC5xdWVyeVBhcmFtcyk7XG4gICAgbGV0IHRpbWVvdXQgPSB1dGlscy5jb3B5KHJlcXVlc3QudGltZW91dCk7XG4gICAgaWYgKHF1ZXJ5UGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHF1ZXJ5UGFyYW1zID0ge307XG4gICAgfVxuICAgIGlmICh0aW1lb3V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICBsZXQgaGVhZGVycyA9IHsuLi51dGlscy5jb3B5KHJlcXVlc3QuaGVhZGVycyksIC4uLmNvbmZpZy5oZWFkZXJzfTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBub3Qgc3BlY2lmaWVkIGFuIG92ZXJyaWRlIGZvciBDb250ZW50IHR5cGUgdGhlIHVzZSBkZWZhdWx0XG4gICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gY29uZmlnLmRlZmF1bHRDb250ZW50VHlwZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoYXMgbm90IHNwZWNpZmllZCBhbiBvdmVycmlkZSBmb3IgQWNjZXB0IHR5cGUgdGhlIHVzZSBkZWZhdWx0XG4gICAgaWYgKGhlYWRlcnNbJ0FjY2VwdCddID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gY29uZmlnLmRlZmF1bHRBY2NlcHRUeXBlO1xuICAgIH1cblxuICAgIGxldCBib2R5ID0gdXRpbHMuY29weShyZXF1ZXN0LmJvZHkpO1xuXG4gICAgbGV0IHVybCA9IGNvbmZpZy5lbmRwb2ludCArIHBhdGg7XG4gICAgbGV0IHF1ZXJ5U3RyaW5nID0gYnVpbGRDYW5vbmljYWxRdWVyeVN0cmluZyhxdWVyeVBhcmFtcyk7XG4gICAgaWYgKHF1ZXJ5U3RyaW5nICE9PSAnJykge1xuICAgICAgdXJsICs9ICc/JyArIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGxldCBzaW1wbGVIdHRwUmVxdWVzdCA9IHtcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgZGF0YTogYm9keVxuICAgIH07XG4gICAgaWYgKGNvbmZpZy5yZXRyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNpbXBsZUh0dHBSZXF1ZXN0LmJhc2VVUkwgPSB1cmw7XG4gICAgICBsZXQgY2xpZW50ID0gYXhpb3MuY3JlYXRlKHNpbXBsZUh0dHBSZXF1ZXN0KTtcblxuICAgICAgLy8gQWxsb3cgdXNlciBjb25maWd1cmFibGUgZGVsYXksIG9yIGJ1aWx0LWluIGV4cG9uZW50aWFsIGRlbGF5XG4gICAgICBsZXQgcmV0cnlEZWxheSA9ICgpID0+IDA7XG4gICAgICBpZiAoY29uZmlnLnJldHJ5RGVsYXkgPT09ICdleHBvbmVudGlhbCcpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9IGF4aW9zUmV0cnkuZXhwb25lbnRpYWxEZWxheTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5yZXRyeURlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXRyeURlbGF5ID0gKCkgPT4gcGFyc2VJbnQoY29uZmlnLnJldHJ5RGVsYXkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLnJldHJ5RGVsYXkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9IGNvbmZpZy5yZXRyeURlbGF5O1xuICAgICAgfVxuXG4gICAgICBheGlvc1JldHJ5KGNsaWVudCwge1xuICAgICAgICByZXRyaWVzOiBjb25maWcucmV0cmllcyxcbiAgICAgICAgcmV0cnlDb25kaXRpb246IGNvbmZpZy5yZXRyeUNvbmRpdGlvbixcbiAgICAgICAgcmV0cnlEZWxheSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNsaWVudC5yZXF1ZXN0KHttZXRob2Q6IHZlcmJ9KTtcbiAgICB9XG4gICAgc2ltcGxlSHR0cFJlcXVlc3QubWV0aG9kID0gdmVyYjtcbiAgICBzaW1wbGVIdHRwUmVxdWVzdC51cmwgPSB1cmw7XG4gICAgcmV0dXJuIGF4aW9zKHNpbXBsZUh0dHBSZXF1ZXN0KTtcbiAgfTtcblxuICByZXR1cm4gc2ltcGxlSHR0cENsaWVudDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNpbXBsZUh0dHBDbGllbnRGYWN0b3J5O1xuIl19