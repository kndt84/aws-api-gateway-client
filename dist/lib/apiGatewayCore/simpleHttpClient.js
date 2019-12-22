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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXBpR2F0ZXdheUNvcmUvc2ltcGxlSHR0cENsaWVudC5qcyJdLCJuYW1lcyI6WyJzaW1wbGVIdHRwQ2xpZW50RmFjdG9yeSIsIm5ld0NsaWVudCIsImNvbmZpZyIsImJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmciLCJxdWVyeVBhcmFtcyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJjYW5vbmljYWxRdWVyeVN0cmluZyIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyIiwic2ltcGxlSHR0cENsaWVudCIsImVuZHBvaW50IiwidXRpbHMiLCJhc3NlcnREZWZpbmVkIiwibWFrZVJlcXVlc3QiLCJyZXF1ZXN0IiwidmVyYiIsInBhdGgiLCJjb3B5IiwidGltZW91dCIsInVuZGVmaW5lZCIsImhlYWRlcnMiLCJkZWZhdWx0Q29udGVudFR5cGUiLCJkZWZhdWx0QWNjZXB0VHlwZSIsImJvZHkiLCJ1cmwiLCJxdWVyeVN0cmluZyIsInNpbXBsZUh0dHBSZXF1ZXN0IiwiZGF0YSIsInJldHJpZXMiLCJiYXNlVVJMIiwiY2xpZW50IiwiYXhpb3MiLCJjcmVhdGUiLCJyZXRyeURlbGF5IiwiYXhpb3NSZXRyeSIsImV4cG9uZW50aWFsRGVsYXkiLCJwYXJzZUludCIsInJldHJ5Q29uZGl0aW9uIiwibWV0aG9kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWdCQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsdUJBQXVCLEdBQUcsRUFBaEM7O0FBQ0FBLHVCQUF1QixDQUFDQyxTQUF4QixHQUFvQyxVQUFDQyxNQUFELEVBQVk7QUFDOUMsV0FBU0MseUJBQVQsQ0FBbUNDLFdBQW5DLEVBQWdEO0FBQzlDO0FBQ0EsUUFBSUMsTUFBTSxDQUFDQyxJQUFQLENBQVlGLFdBQVosRUFBeUJHLE1BQXpCLEdBQWtDLENBQXRDLEVBQXlDO0FBQ3ZDLGFB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SW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuICogWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogQSBjb3B5IG9mIHRoZSBMaWNlbnNlIGlzIGxvY2F0ZWQgYXRcbiAqXG4gKiAgaHR0cDovL2F3cy5hbWF6b24uY29tL2FwYWNoZTIuMFxuICpcbiAqIG9yIGluIHRoZSBcImxpY2Vuc2VcIiBmaWxlIGFjY29tcGFueWluZyB0aGlzIGZpbGUuIFRoaXMgZmlsZSBpcyBkaXN0cmlidXRlZFxuICogb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZ1xuICogcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG4vKiBlc2xpbnQgbWF4LWxlbjogW1wiZXJyb3JcIiwgMTAwXSovXG5cbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgYXhpb3NSZXRyeSBmcm9tICdheGlvcy1yZXRyeSc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHNpbXBsZUh0dHBDbGllbnRGYWN0b3J5ID0ge307XG5zaW1wbGVIdHRwQ2xpZW50RmFjdG9yeS5uZXdDbGllbnQgPSAoY29uZmlnKSA9PiB7XG4gIGZ1bmN0aW9uIGJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmcocXVlcnlQYXJhbXMpIHtcbiAgICAvLyBCdWlsZCBhIHByb3Blcmx5IGVuY29kZWQgcXVlcnkgc3RyaW5nIGZyb20gYSBRdWVyeVBhcmFtIG9iamVjdFxuICAgIGlmIChPYmplY3Qua2V5cyhxdWVyeVBhcmFtcykubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGxldCBjYW5vbmljYWxRdWVyeVN0cmluZyA9ICcnO1xuICAgIGZvciAobGV0IHByb3BlcnR5IGluIHF1ZXJ5UGFyYW1zKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHF1ZXJ5UGFyYW1zLCBcInByb3BlcnR5XCIpKSB7XG4gICAgICAgIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nICs9IGVuY29kZVVSSUNvbXBvbmVudChwcm9wZXJ0eSlcbiAgICAgICAgICArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeVBhcmFtc1twcm9wZXJ0eV0pICsgJyYnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjYW5vbmljYWxRdWVyeVN0cmluZy5zdWJzdHIoMCwgY2Fub25pY2FsUXVlcnlTdHJpbmcubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBsZXQgc2ltcGxlSHR0cENsaWVudCA9IHsgfTtcbiAgc2ltcGxlSHR0cENsaWVudC5lbmRwb2ludCA9IHV0aWxzLmFzc2VydERlZmluZWQoY29uZmlnLmVuZHBvaW50LCAnZW5kcG9pbnQnKTtcblxuICBzaW1wbGVIdHRwQ2xpZW50Lm1ha2VSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgIGxldCB2ZXJiID0gdXRpbHMuYXNzZXJ0RGVmaW5lZChyZXF1ZXN0LnZlcmIsICd2ZXJiJyk7XG4gICAgbGV0IHBhdGggPSB1dGlscy5hc3NlcnREZWZpbmVkKHJlcXVlc3QucGF0aCwgJ3BhdGgnKTtcbiAgICBsZXQgcXVlcnlQYXJhbXMgPSB1dGlscy5jb3B5KHJlcXVlc3QucXVlcnlQYXJhbXMpO1xuICAgIGxldCB0aW1lb3V0ID0gdXRpbHMuY29weShyZXF1ZXN0LnRpbWVvdXQpO1xuICAgIGlmIChxdWVyeVBhcmFtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBxdWVyeVBhcmFtcyA9IHt9O1xuICAgIH1cbiAgICBpZiAodGltZW91dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lb3V0ID0gMDtcbiAgICB9XG4gICAgbGV0IGhlYWRlcnMgPSB7Li4udXRpbHMuY29weShyZXF1ZXN0LmhlYWRlcnMpLCAuLi5jb25maWcuaGVhZGVyc307XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoYXMgbm90IHNwZWNpZmllZCBhbiBvdmVycmlkZSBmb3IgQ29udGVudCB0eXBlIHRoZSB1c2UgZGVmYXVsdFxuICAgIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IGNvbmZpZy5kZWZhdWx0Q29udGVudFR5cGU7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGFzIG5vdCBzcGVjaWZpZWQgYW4gb3ZlcnJpZGUgZm9yIEFjY2VwdCB0eXBlIHRoZSB1c2UgZGVmYXVsdFxuICAgIGlmIChoZWFkZXJzWydBY2NlcHQnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoZWFkZXJzWydBY2NlcHQnXSA9IGNvbmZpZy5kZWZhdWx0QWNjZXB0VHlwZTtcbiAgICB9XG5cbiAgICBsZXQgYm9keSA9IHV0aWxzLmNvcHkocmVxdWVzdC5ib2R5KTtcblxuICAgIGxldCB1cmwgPSBjb25maWcuZW5kcG9pbnQgKyBwYXRoO1xuICAgIGxldCBxdWVyeVN0cmluZyA9IGJ1aWxkQ2Fub25pY2FsUXVlcnlTdHJpbmcocXVlcnlQYXJhbXMpO1xuICAgIGlmIChxdWVyeVN0cmluZyAhPT0gJycpIHtcbiAgICAgIHVybCArPSAnPycgKyBxdWVyeVN0cmluZztcbiAgICB9XG5cbiAgICBsZXQgc2ltcGxlSHR0cFJlcXVlc3QgPSB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgIGRhdGE6IGJvZHlcbiAgICB9O1xuICAgIGlmIChjb25maWcucmV0cmllcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzaW1wbGVIdHRwUmVxdWVzdC5iYXNlVVJMID0gdXJsO1xuICAgICAgbGV0IGNsaWVudCA9IGF4aW9zLmNyZWF0ZShzaW1wbGVIdHRwUmVxdWVzdCk7XG5cbiAgICAgIC8vIEFsbG93IHVzZXIgY29uZmlndXJhYmxlIGRlbGF5LCBvciBidWlsdC1pbiBleHBvbmVudGlhbCBkZWxheVxuICAgICAgbGV0IHJldHJ5RGVsYXkgPSAoKSA9PiAwO1xuICAgICAgaWYgKGNvbmZpZy5yZXRyeURlbGF5ID09PSAnZXhwb25lbnRpYWwnKSB7XG4gICAgICAgIHJldHJ5RGVsYXkgPSBheGlvc1JldHJ5LmV4cG9uZW50aWFsRGVsYXk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcucmV0cnlEZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0cnlEZWxheSA9ICgpID0+IHBhcnNlSW50KGNvbmZpZy5yZXRyeURlbGF5KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5yZXRyeURlbGF5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHJ5RGVsYXkgPSBjb25maWcucmV0cnlEZWxheTtcbiAgICAgIH1cblxuICAgICAgYXhpb3NSZXRyeShjbGllbnQsIHtcbiAgICAgICAgcmV0cmllczogY29uZmlnLnJldHJpZXMsXG4gICAgICAgIHJldHJ5Q29uZGl0aW9uOiBjb25maWcucmV0cnlDb25kaXRpb24sXG4gICAgICAgIHJldHJ5RGVsYXksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjbGllbnQucmVxdWVzdCh7bWV0aG9kOiB2ZXJifSk7XG4gICAgfVxuICAgIHNpbXBsZUh0dHBSZXF1ZXN0Lm1ldGhvZCA9IHZlcmI7XG4gICAgc2ltcGxlSHR0cFJlcXVlc3QudXJsID0gdXJsO1xuICAgIHJldHVybiBheGlvcyhzaW1wbGVIdHRwUmVxdWVzdCk7XG4gIH07XG5cbiAgcmV0dXJuIHNpbXBsZUh0dHBDbGllbnQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaW1wbGVIdHRwQ2xpZW50RmFjdG9yeTtcbiJdfQ==