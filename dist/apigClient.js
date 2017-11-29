'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
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

// import 'babel-polyfill';


var _urlTemplate = require('url-template');

var _urlTemplate2 = _interopRequireDefault(_urlTemplate);

var _apiGatewayClient = require('./lib/apiGatewayCore/apiGatewayClient');

var _apiGatewayClient2 = _interopRequireDefault(_apiGatewayClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apigClientFactory = {};

var removeEmpty = function removeEmpty(obj) {
  Object.keys(obj).forEach(function (key) {
    return obj[key] && _typeof(obj[key]) === 'object' && removeEmpty(obj[key]) || obj[key] === undefined && delete obj[key];
  });
  return obj;
};

apigClientFactory.newClient = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var apigClient = {};

  config = Object.assign({
    accessKey: '',
    secretKey: '',
    sessionToken: '',
    region: 'us-east-1',
    apiKey: '',
    invokeUrl: '',
    service: 'execute-api',
    defaultContentType: 'application/json',
    defaultAcceptType: 'application/json',
    systemClockOffset: 0
  }, removeEmpty(config));

  // extract endpoint and path from url
  var invokeUrl = config.invokeUrl;
  var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
  var pathComponent = invokeUrl.substring(endpoint.length);

  var sigV4ClientConfig = {
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    sessionToken: config.sessionToken,
    serviceName: config.service,
    region: config.region,
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
    systemClockOffset: config.systemClockOffset,
    retries: config.retries,
    retryCondition: config.retryCondition
  };

  var authType = 'NONE';
  if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
    authType = 'AWS_IAM';
  }

  var simpleHttpClientConfig = {
    endpoint: endpoint,
    defaultContentType: config.defaultContentType,
    defaultAcceptType: config.defaultAcceptType,
    retries: config.retries,
    retryCondition: config.retryCondition
  };

  var apiGatewayClient = _apiGatewayClient2.default.newClient(simpleHttpClientConfig, sigV4ClientConfig);

  apigClient.invokeApi = function (params, pathTemplate, method, additionalParams, body) {
    if (additionalParams === undefined) additionalParams = {};
    if (body === undefined) body = '';

    var request = {
      verb: method.toUpperCase(),
      path: pathComponent + _urlTemplate2.default.parse(pathTemplate).expand(params),
      headers: additionalParams.headers || {},
      queryParams: additionalParams.queryParams,
      body: body
    };

    return apiGatewayClient.makeRequest(request, authType, additionalParams, config.apiKey);
  };

  return apigClient;
};

exports.default = apigClientFactory;