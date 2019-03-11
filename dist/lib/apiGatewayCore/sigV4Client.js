'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosRetry = require('axios-retry');

var _axiosRetry2 = _interopRequireDefault(_axiosRetry);

var _sha = require('crypto-js/sha256');

var _sha2 = _interopRequireDefault(_sha);

var _encHex = require('crypto-js/enc-hex');

var _encHex2 = _interopRequireDefault(_encHex);

var _hmacSha = require('crypto-js/hmac-sha256');

var _hmacSha2 = _interopRequireDefault(_hmacSha);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sigV4ClientFactory = {}; /*
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

sigV4ClientFactory.newClient = function (config) {
  var AWS_SHA_256 = 'AWS4-HMAC-SHA256';
  var AWS4_REQUEST = 'aws4_request';
  var AWS4 = 'AWS4';
  var X_AMZ_DATE = 'x-amz-date';
  var X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
  var HOST = 'host';
  var AUTHORIZATION = 'Authorization';

  function hash(value) {
    return (0, _sha2.default)(value); // eslint-disable-line
  }

  function hexEncode(value) {
    return value.toString(_encHex2.default);
  }

  function hmac(secret, value) {
    return (0, _hmacSha2.default)(value, secret, { asBytes: true }); // eslint-disable-line
  }

  function buildCanonicalRequest(method, path, queryParams, headers, payload) {
    return method + '\n' + buildCanonicalUri(path) + '\n' + buildCanonicalQueryString(queryParams) + '\n' + buildCanonicalHeaders(headers) + '\n' + buildCanonicalSignedHeaders(headers) + '\n' + hexEncode(hash(payload));
  }

  function hashCanonicalRequest(request) {
    return hexEncode(hash(request));
  }

  function buildCanonicalUri(uri) {
    return encodeURI(uri);
  }

  function buildCanonicalQueryString(queryParams) {
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    var sortedQueryParams = [];
    for (var property in queryParams) {
      if (queryParams.hasOwnProperty(property)) {
        sortedQueryParams.push(property);
      }
    }
    sortedQueryParams.sort();

    var canonicalQueryString = '';
    for (var i = 0; i < sortedQueryParams.length; i++) {
      canonicalQueryString += sortedQueryParams[i] + '=' + fixedEncodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
    }
    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  function buildCanonicalHeaders(headers) {
    var canonicalHeaders = '';
    var sortedKeys = [];
    for (var property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property);
      }
    }
    sortedKeys.sort();

    for (var i = 0; i < sortedKeys.length; i++) {
      canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
    }
    return canonicalHeaders;
  }

  function buildCanonicalSignedHeaders(headers) {
    var sortedKeys = [];
    for (var property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property.toLowerCase());
      }
    }
    sortedKeys.sort();

    return sortedKeys.join(';');
  }

  function buildStringToSign(datetime, credentialScope, hashedCanonicalRequest) {
    return AWS_SHA_256 + '\n' + datetime + '\n' + credentialScope + '\n' + hashedCanonicalRequest;
  }

  function buildCredentialScope(datetime, region, service) {
    return datetime.substr(0, 8) + '/' + region + '/' + service + '/' + AWS4_REQUEST;
  }

  function calculateSigningKey(secretKey, datetime, region, service) {
    return hmac(hmac(hmac(hmac(AWS4 + secretKey, datetime.substr(0, 8)), region), service), AWS4_REQUEST);
  }

  function calculateSignature(key, stringToSign) {
    return hexEncode(hmac(key, stringToSign));
  }

  function buildAuthorizationHeader(accessKey, credentialScope, headers, signature) {
    return AWS_SHA_256 + ' Credential=' + accessKey + '/' + credentialScope + ', SignedHeaders=' + buildCanonicalSignedHeaders(headers) + ', Signature=' + signature;
  }

  var awsSigV4Client = {};
  if (config.accessKey === undefined || config.secretKey === undefined) {
    return awsSigV4Client;
  }
  awsSigV4Client.accessKey = _utils2.default.assertDefined(config.accessKey, 'accessKey');
  awsSigV4Client.secretKey = _utils2.default.assertDefined(config.secretKey, 'secretKey');
  awsSigV4Client.sessionToken = config.sessionToken;
  awsSigV4Client.serviceName = _utils2.default.assertDefined(config.serviceName, 'serviceName');
  awsSigV4Client.region = _utils2.default.assertDefined(config.region, 'region');
  awsSigV4Client.endpoint = _utils2.default.assertDefined(config.endpoint, 'endpoint');
  awsSigV4Client.retries = config.retries;
  awsSigV4Client.retryCondition = config.retryCondition;
  awsSigV4Client.host = config.host;

  awsSigV4Client.makeRequest = function (request) {
    var verb = _utils2.default.assertDefined(request.verb, 'verb');
    var path = _utils2.default.assertDefined(request.path, 'path');
    var queryParams = _utils2.default.copy(request.queryParams);
    var timeout = _utils2.default.copy(request.timeout);

    if (queryParams === undefined) {
      queryParams = {};
    }

    if (timeout === undefined) {
      timeout = 0;
    }
    var headers = _utils2.default.copy(request.headers);
    if (headers === undefined) {
      headers = {};
    }

    // If the user has not specified an override for Content type the use default
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    // If the user has not specified an override for Accept type the use default
    if (headers['Accept'] === undefined) {
      headers['Accept'] = config.defaultAcceptType;
    }

    var body = _utils2.default.copy(request.body);

    // stringify request body if content type is JSON
    if (body && headers['Content-Type'] && headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body);
    }

    // If there is no body remove the content-type header so it is not included in SigV4 calculation
    if (body === '' || body === undefined || body === null) {
      delete headers['Content-Type'];
    }

    var datetime = new Date(new Date().getTime() + config.systemClockOffset).toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:\-]|\.\d{3}/g, '');
    headers[X_AMZ_DATE] = datetime;

    if (awsSigV4Client.host) {
      headers[HOST] = awsSigV4Client.host;
    } else {
      var parser = _url2.default.parse(awsSigV4Client.endpoint);
      headers[HOST] = parser.host;
    }

    var canonicalRequest = buildCanonicalRequest(verb, path, queryParams, headers, body);
    var hashedCanonicalRequest = hashCanonicalRequest(canonicalRequest);
    var credentialScope = buildCredentialScope(datetime, awsSigV4Client.region, awsSigV4Client.serviceName);
    var stringToSign = buildStringToSign(datetime, credentialScope, hashedCanonicalRequest);
    var signingKey = calculateSigningKey(awsSigV4Client.secretKey, datetime, awsSigV4Client.region, awsSigV4Client.serviceName);
    var signature = calculateSignature(signingKey, stringToSign);
    headers[AUTHORIZATION] = buildAuthorizationHeader(awsSigV4Client.accessKey, credentialScope, headers, signature);
    if (awsSigV4Client.sessionToken !== undefined && awsSigV4Client.sessionToken !== '') {
      headers[X_AMZ_SECURITY_TOKEN] = awsSigV4Client.sessionToken;
    }
    delete headers[HOST];

    var url = config.endpoint + path;
    var queryString = buildCanonicalQueryString(queryParams);
    if (queryString !== '') {
      url += '?' + queryString;
    }

    // Need to re-attach Content-Type if it is not specified at this point
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    var signedRequest = {
      headers: headers,
      timeout: timeout,
      data: body
    };
    if (config.retries !== undefined) {
      signedRequest.baseURL = url;
      var client = _axios2.default.create(signedRequest);
      (0, _axiosRetry2.default)(client, {
        retries: config.retries,
        retryCondition: config.retryCondition
      });
      return client.request({ method: verb });
    }
    signedRequest.method = verb;
    signedRequest.url = url;
    return (0, _axios2.default)(signedRequest);
  };

  return awsSigV4Client;
};

exports.default = sigV4ClientFactory;